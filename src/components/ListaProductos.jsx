import TarjetaProducto from "./TarjetaProducto";

function ListaProductos({ productos }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          id={producto.id}
          nombre={producto.nombre}
          categoria={producto.categoria}
          descripcion={producto.descripcion}
          precio={producto.precio}
        />
      ))}
    </div>
  );
}

export default ListaProductos;
