import http from "http";
import path from "path";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import * as esbuild from "esbuild";
import { transformSync } from "@babel/core";
import istanbul from "babel-plugin-istanbul";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const carpetaTests = path.join(raiz, "tests");
const puerto = process.env.PUERTO_PRUEBAS || 3002;
const sinMedir = ["api.js", "EncabezadoConRuta.jsx"];

function archivosDe(carpeta) {
  return readdirSync(path.join(raiz, "src", carpeta))
    .filter((nombre) => /\.jsx?$/.test(nombre) && !sinMedir.includes(nombre))
    .map((nombre) => "../src/" + carpeta + "/" + nombre);
}

function crearEntrada() {
  const pruebas = readdirSync(carpetaTests)
    .filter((nombre) => /\.spec\.jsx?$/.test(nombre))
    .map((nombre) => "./" + nombre);
  const codigo = [...archivosDe("components"), ...archivosDe("utils")];
  return [...pruebas, ...codigo, "./cobertura.js"].map((ruta) => 'import "' + ruta + '";').join("\n");
}

const medirCobertura = {
  name: "medir-cobertura",
  setup(build) {
    build.onLoad({ filter: /[\\/]src[\\/].*\.jsx?$/ }, (args) => {
      const resultado = transformSync(readFileSync(args.path, "utf8"), {
        filename: args.path,
        babelrc: false,
        configFile: false,
        parserOpts: { plugins: ["jsx"] },
        plugins: [[istanbul, { cwd: raiz }]],
      });
      return { contents: resultado.code, loader: "jsx" };
    });
  },
};

async function compilarPruebas() {
  const resultado = await esbuild.build({
    stdin: { contents: crearEntrada(), resolveDir: carpetaTests, loader: "js" },
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    jsx: "automatic",
    loader: { ".js": "jsx" },
    banner: { js: 'var process = { env: { NODE_ENV: "development" } };' },
    plugins: [medirCobertura],
    logLevel: "silent",
  });
  return resultado.outputFiles[0].text;
}

const pagina = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Pruebas QUnit | Luna y Papel</title>
  <link rel="stylesheet" href="/qunit.css">
</head>
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>
  <h2>Cobertura de src/components y src/utils</h2>
  <pre id="cobertura">Esperando a que terminen las pruebas...</pre>
  <script src="/qunit.js"></script>
  <script src="/pruebas.js"></script>
</body>
</html>`;

const servidor = http.createServer(async (req, res) => {
  const ruta = req.url.split("?")[0];
  try {
    if (ruta === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(pagina);
    } else if (ruta === "/qunit.js") {
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      res.end(readFileSync(path.join(raiz, "node_modules/qunit/qunit/qunit.js")));
    } else if (ruta === "/qunit.css") {
      res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
      res.end(readFileSync(path.join(raiz, "node_modules/qunit/qunit/qunit.css")));
    } else if (ruta === "/pruebas.js") {
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      res.end(await compilarPruebas());
    } else {
      res.writeHead(404);
      res.end("No encontrado");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(error.message));
  }
});

servidor.listen(puerto, () => {
  console.log("Pruebas QUnit disponibles en: http://localhost:" + puerto);
  console.log("Abre esa URL en el navegador. Recarga la pagina para volver a ejecutarlas.");
});
