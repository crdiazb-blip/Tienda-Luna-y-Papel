import { buscarProducto } from "../data/productos";

// Total = precio del catálogo × cantidad.
// El precio se busca por id en el catálogo: así nadie puede alterarlo desde el formulario.
// Si el producto no existe devuelve null.
export function calcularTotal(idProducto, cantidad) {
  const producto = buscarProducto(idProducto);
  if (!producto) {
    return null;
  }
  return producto.precio * Number(cantidad);
}

// Convierte un número a pesos chilenos. Ejemplo: 13980 -> "$13.980".
export function formatearPesos(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}
