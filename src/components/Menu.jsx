import Link from "next/link";

const enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/pedido", texto: "Pedido" },
];

function Menu({ rutaActual, alElegir }) {
  return (
    <ul className="navbar-nav ms-md-auto">
      {enlaces.map((enlace) => {
        const activo = enlace.ruta === rutaActual;
        return (
          <li className="nav-item" key={enlace.ruta}>
            <Link
              className={activo ? "nav-link active" : "nav-link"}
              aria-current={activo ? "page" : undefined}
              href={enlace.ruta}
              onClick={alElegir}
            >
              {enlace.texto}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default Menu;
