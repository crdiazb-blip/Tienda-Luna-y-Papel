export function resumirProductos(productos) {
  if (productos.length === 0) {
    return null;
  }

  const sumaPrecios = productos.reduce((suma, producto) => suma + producto.precio, 0);
  const masCaro = productos.reduce((mayor, producto) => (producto.precio > mayor.precio ? producto : mayor));
  const masBarato = productos.reduce((menor, producto) => (producto.precio < menor.precio ? producto : menor));

  const conteo = {};
  productos.forEach((producto) => {
    conteo[producto.categoria] = (conteo[producto.categoria] || 0) + 1;
  });
  const categorias = Object.keys(conteo).map((nombre) => ({ nombre, cantidad: conteo[nombre] }));

  return {
    total: productos.length,
    promedio: Math.round(sumaPrecios / productos.length),
    masCaro,
    masBarato,
    categorias,
  };
}
