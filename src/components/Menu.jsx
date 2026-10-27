import Link from "next/link";

const enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/pedido", texto: "Pedido" },
  { ruta: "/admin", texto: "Admin" },
];

const claseBase = "flex min-h-11 items-center px-4 py-2 font-bold no-underline";

function Menu({ rutaActual, alElegir }) {
  return (
    <ul className="flex flex-col md:flex-row">
      {enlaces.map((enlace) => {
        const activo = enlace.ruta === rutaActual;
        return (
          <li key={enlace.ruta}>
            <Link
              className={
                activo
                  ? claseBase + " bg-dorado text-black"
                  : claseBase + " text-white hover:bg-dorado hover:text-black"
              }
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
