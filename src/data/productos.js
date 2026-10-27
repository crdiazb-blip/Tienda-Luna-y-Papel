// Catálogo único de Luna y Papel.
// Lo usan tanto la página Productos como el formulario de Pedido, así los precios
// siempre salen de este arreglo y no de un valor escrito en el formulario.
export const productos = [
  {
    id: "cuaderno-punteado",
    nombre: "Cuaderno Punteado",
    categoria: "CUADERNOS",
    descripcion: "80 hojas, tapa dura y elástico de cierre.",
    precio: 6990,
  },
  {
    id: "set-destacadores",
    nombre: "Set de Destacadores",
    categoria: "ESCRITURA",
    descripcion: "Seis colores suaves con punta biselada.",
    precio: 4500,
  },
  {
    id: "planificador-semanal",
    nombre: "Planificador Semanal",
    categoria: "ORGANIZACIÓN",
    descripcion: "50 hojas desprendibles para organizar cada semana.",
    precio: 5990,
  },
  {
    id: "estuche-tela",
    nombre: "Estuche de Tela",
    categoria: "ACCESORIOS",
    descripcion: "Estuche liviano con cierre y dos compartimentos.",
    precio: 7500,
  },
];

// Devuelve el producto con ese id, o undefined si no existe en el catálogo.
export function buscarProducto(id) {
  return productos.find((producto) => producto.id === id);
}
