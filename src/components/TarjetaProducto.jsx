import Link from "next/link";
import { formatearPesos } from "../utils/calcularTotal";

function TarjetaProducto({ id, nombre, categoria, descripcion, precio }) {
  return (
    <article className="flex h-full flex-col border border-[tan] bg-white p-5">
      <p className="texto-pequeno">{categoria}</p>
      <h2 className="text-xl">{nombre}</h2>
      <p>{descripcion}</p>
      <p className="mt-auto text-2xl font-bold text-oliva">{formatearPesos(precio)}</p>
      <Link className="boton self-start" href={`/pedido?producto=${id}`}>
        Pedir
      </Link>
    </article>
  );
}

export default TarjetaProducto;
