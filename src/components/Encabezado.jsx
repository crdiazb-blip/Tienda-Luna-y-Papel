"use client";

import { useState } from "react";
import Link from "next/link";
import Menu from "./Menu";

function Encabezado({ rutaActual }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="bg-oliva text-white">
      <nav
        className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between px-5 py-3"
        aria-label="Navegación principal"
      >
        <Link
          className="px-2 text-2xl font-bold text-white no-underline"
          href="/"
          onClick={() => setMenuAbierto(false)}
        >
          Luna y Papel
        </Link>
        <button
          type="button"
          className="min-h-11 min-w-11 cursor-pointer rounded border border-white px-3 font-bold md:hidden"
          aria-controls="menu-principal"
          aria-expanded={menuAbierto}
          aria-label="Mostrar u ocultar el menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          Menú
        </button>
        <div id="menu-principal" className={menuAbierto ? "block w-full md:w-auto" : "hidden w-full md:block md:w-auto"}>
          <Menu rutaActual={rutaActual} alElegir={() => setMenuAbierto(false)} />
        </div>
      </nav>
    </header>
  );
}

export default Encabezado;
