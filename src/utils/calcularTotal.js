import { buscarProducto } from "../data/productos";

export function calcularTotal(idProducto, cantidad) {
  const producto = buscarProducto(idProducto);
  if (!producto) {
    return null;
  }
  return producto.precio * Number(cantidad);
}

export function formatearPesos(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}
