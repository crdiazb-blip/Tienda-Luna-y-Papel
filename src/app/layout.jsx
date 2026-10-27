import "./estilos.css";
import EncabezadoConRuta from "../components/EncabezadoConRuta";
import PiePagina from "../components/PiePagina";

export const metadata = {
  title: "Luna y Papel",
  description: "Papelería para estudiar y crear",
};

export default function LayoutPrincipal({ children }) {
  return (
    <html lang="es">
      <body>
        <EncabezadoConRuta />
        <main className="mx-auto max-w-[1100px]">{children}</main>
        <PiePagina />
      </body>
    </html>
  );
}
