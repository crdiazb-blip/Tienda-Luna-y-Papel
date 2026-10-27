const urlApi = process.env.URL_API || "http://localhost:3001";

export async function obtenerProductos() {
  try {
    const respuesta = await fetch(urlApi + "/productos", { cache: "no-store" });
    if (!respuesta.ok) {
      return [];
    }
    return await respuesta.json();
  } catch (error) {
    return [];
  }
}
