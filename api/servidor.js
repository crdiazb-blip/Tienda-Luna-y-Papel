import http from "http";
import { readFileSync } from "fs";

const productos = JSON.parse(readFileSync(new URL("./productos.json", import.meta.url), "utf8"));
const puerto = process.env.PUERTO_API || 3001;

function responder(res, codigo, datos) {
  res.writeHead(codigo, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(datos));
}

const servidor = http.createServer((req, res) => {
  const ruta = req.url.split("?")[0];

  if (req.method === "GET" && ruta === "/productos") {
    responder(res, 200, productos);
    return;
  }

  if (req.method === "GET" && ruta.startsWith("/productos/")) {
    const id = ruta.replace("/productos/", "");
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      responder(res, 200, producto);
    } else {
      responder(res, 404, { error: "Producto no encontrado" });
    }
    return;
  }

  responder(res, 404, { error: "Ruta no encontrada" });
});

servidor.listen(puerto, () => {
  console.log("API de Luna y Papel lista en http://localhost:" + puerto + "/productos");
});
