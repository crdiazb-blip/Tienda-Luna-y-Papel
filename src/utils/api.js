const urlApi = process.env.URL_API || "http://localhost:3001";
const claveApi = process.env.CLAVE_API || "clave-api-desarrollo";

export async function obtenerProductos() {
  try {
    const respuesta = await fetch(urlApi + "/productos", { cache: "no-store" });
    if (!respuesta.ok) {
      return null;
    }
    return await respuesta.json();
  } catch (error) {
    return null;
  }
}

async function pedirCambio(ruta, opciones) {
  try {
    const respuesta = await fetch(urlApi + ruta, {
      cache: "no-store",
      ...opciones,
      headers: { "Content-Type": "application/json", "x-clave-api": claveApi },
    });
    return respuesta.status;
  } catch (error) {
    return 0;
  }
}

export function guardarProductoEnApi(producto) {
  return pedirCambio("/productos", { method: "POST", body: JSON.stringify(producto) });
}

export function eliminarProductoEnApi(id) {
  return pedirCambio("/productos/" + encodeURIComponent(id), { method: "DELETE" });
}
