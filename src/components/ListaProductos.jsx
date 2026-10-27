import TarjetaProducto from "./TarjetaProducto";

// Recibe el arreglo "productos" por props y dibuja una TarjetaProducto por cada uno (map).
// "key" ayuda a React a distinguir cada elemento de la lista.
function ListaProductos({ productos }) {
  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <TarjetaProducto
            id={producto.id}
            nombre={producto.nombre}
            categoria={producto.categoria}
            descripcion={producto.descripcion}
            precio={producto.precio}
          />
        </div>
      ))}
    </div>
  );
}

export default ListaProductos;
