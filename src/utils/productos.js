export function buscarProducto(productos, id) {
  return productos.find((producto) => producto.id === id);
}
