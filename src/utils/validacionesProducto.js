export function crearIdProducto(nombre) {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validarProductoNuevo(datos) {
  const errores = {};
  const nombre = datos.nombre.trim();
  const categoria = datos.categoria.trim();
  const descripcion = datos.descripcion.trim();
  const precio = datos.precio.trim();

  if (nombre.length < 3 || nombre.length > 60 || crearIdProducto(nombre) === "") {
    errores.nombre = "El nombre debe tener entre 3 y 60 caracteres y al menos una letra o número.";
  }
  if (categoria.length < 3 || categoria.length > 30) {
    errores.categoria = "La categoría debe tener entre 3 y 30 caracteres.";
  }
  if (descripcion.length < 5 || descripcion.length > 120) {
    errores.descripcion = "La descripción debe tener entre 5 y 120 caracteres.";
  }
  if (!/^\d+$/.test(precio) || Number(precio) < 1 || Number(precio) > 1000000) {
    errores.precio = "El precio debe ser un número entero entre 1 y 1.000.000.";
  }
  return errores;
}
