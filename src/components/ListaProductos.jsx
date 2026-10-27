import TarjetaProducto from "./TarjetaProducto";

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
