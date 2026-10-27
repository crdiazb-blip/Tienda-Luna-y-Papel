import { Link } from "react-router-dom";
import { formatearPesos } from "../utils/calcularTotal";

function TarjetaProducto({ id, nombre, categoria, descripcion, precio }) {
  return (
    <article className="card h-100 tarjeta-producto">
      <div className="card-body d-flex flex-column">
        <p className="categoria">{categoria}</p>
        <h2 className="h4 card-title">{nombre}</h2>
        <p className="card-text">{descripcion}</p>
        <p className="precio mt-auto">{formatearPesos(precio)}</p>
        <Link className="btn btn-luna align-self-start" to={`/pedido?producto=${id}`}>
          Pedir
        </Link>
      </div>
    </article>
  );
}

export default TarjetaProducto;
