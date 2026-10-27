import http from "http";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs";

const archivoBase = new URL("./productos.json", import.meta.url);
const archivoDatos = new URL("./datos.json", import.meta.url);
const puerto = process.env.PUERTO_API || 3001;
const claveApi = process.env.CLAVE_API || "clave-api-desarrollo";

if (!existsSync(archivoDatos)) {
  copyFileSync(archivoBase, archivoDatos);
}

let productos = JSON.parse(readFileSync(archivoDatos, "utf8"));

function guardar() {
  writeFileSync(archivoDatos, JSON.stringify(productos, null, 2));
}

function responder(res, codigo, datos) {
  res.writeHead(codigo, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(datos));
}

function leerCuerpo(req) {
  return new Promise((resolver) => {
    let texto = "";
    req.on("data", (trozo) => {
      texto += trozo;
    });
    req.on("end", () => {
      try {
        resolver(JSON.parse(texto));
      } catch (error) {
        resolver(null);
      }
    });
  });
}

function productoValido(p) {
  return (
    p !== null &&
    typeof p === "object" &&
    typeof p.id === "string" && p.id !== "" &&
    typeof p.nombre === "string" && p.nombre !== "" &&
    typeof p.categoria === "string" && p.categoria !== "" &&
    typeof p.descripcion === "string" && p.descripcion !== "" &&
    Number.isInteger(p.precio) && p.precio > 0
  );
}

const servidor = http.createServer(async (req, res) => {
  const ruta = req.url.split("?")[0];

  if (req.method === "GET" && ruta === "/productos") {
    responder(res, 200, productos);
    return;
  }

  if (req.method === "GET" && ruta.startsWith("/productos/")) {
    const id = decodeURIComponent(ruta.replace("/productos/", ""));
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      responder(res, 200, producto);
    } else {
      responder(res, 404, { error: "Producto no encontrado" });
    }
    return;
  }

  const esCambio = (req.method === "POST" && ruta === "/productos") ||
    (req.method === "DELETE" && ruta.startsWith("/productos/"));

  if (esCambio && req.headers["x-clave-api"] !== claveApi) {
    responder(res, 401, { error: "Falta la clave de la API" });
    return;
  }

  if (req.method === "POST" && ruta === "/productos") {
    const nuevo = await leerCuerpo(req);
    if (!productoValido(nuevo)) {
      responder(res, 400, { error: "Datos del producto no validos" });
      return;
    }
    if (productos.some((p) => p.id === nuevo.id)) {
      responder(res, 409, { error: "Ya existe un producto con ese id" });
      return;
    }
    const producto = {
      id: nuevo.id,
      nombre: nuevo.nombre,
      categoria: nuevo.categoria,
      descripcion: nuevo.descripcion,
      precio: nuevo.precio,
    };
    productos.push(producto);
    guardar();
    responder(res, 201, producto);
    return;
  }

  if (req.method === "DELETE" && ruta.startsWith("/productos/")) {
    const id = decodeURIComponent(ruta.replace("/productos/", ""));
    if (!productos.some((p) => p.id === id)) {
      responder(res, 404, { error: "Producto no encontrado" });
      return;
    }
    productos = productos.filter((p) => p.id !== id);
    guardar();
    responder(res, 200, { eliminado: id });
    return;
  }

  responder(res, 404, { error: "Ruta no encontrada" });
});

servidor.listen(puerto, () => {
  console.log("API de Luna y Papel lista en http://localhost:" + puerto + "/productos");
});
