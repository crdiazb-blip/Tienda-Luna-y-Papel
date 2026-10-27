import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/pedido", texto: "Pedido" },
];

// Lista de enlaces de navegación. NavLink de React Router marca automáticamente
// con la clase "active" (y aria-current="page") el enlace de la página actual.
// "alElegir" es una función que llega por props: el Encabezado la usa para cerrar el menú en móvil.
function Menu({ alElegir }) {
  return (
    <ul className="navbar-nav ms-md-auto">
      {enlaces.map((enlace) => (
        <li className="nav-item" key={enlace.ruta}>
          <NavLink className="nav-link" to={enlace.ruta} end onClick={alElegir}>
            {enlace.texto}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Menu;
