import { buscarProducto } from "./productos";

export function calcularTotal(productos, idProducto, cantidad) {
  const producto = buscarProducto(productos, idProducto);
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
