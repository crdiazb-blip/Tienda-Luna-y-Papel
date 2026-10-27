"use client";

import { usePathname } from "next/navigation";
import Encabezado from "./Encabezado";

function EncabezadoConRuta() {
  const rutaActual = usePathname();
  return <Encabezado rutaActual={rutaActual} />;
}

export default EncabezadoConRuta;
