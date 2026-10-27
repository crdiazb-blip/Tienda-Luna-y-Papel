import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/pedido", texto: "Pedido" },
];

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
