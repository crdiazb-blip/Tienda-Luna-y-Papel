import { useState } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";

function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="encabezado">
      <nav className="navbar navbar-expand-md container-lg" aria-label="Navegación principal">
        <Link className="navbar-brand marca" to="/" onClick={() => setMenuAbierto(false)}>
          Luna y Papel
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          aria-controls="menu-principal"
          aria-expanded={menuAbierto}
          aria-label="Mostrar u ocultar el menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="menu-principal" className={menuAbierto ? "collapse navbar-collapse show" : "collapse navbar-collapse"}>
          <Menu alElegir={() => setMenuAbierto(false)} />
        </div>
      </nav>
    </header>
  );
}

export default Encabezado;
