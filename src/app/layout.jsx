import "bootstrap/dist/css/bootstrap.min.css";
import "./estilos.css";
import EncabezadoConRuta from "../components/EncabezadoConRuta";
import PiePagina from "../components/PiePagina";

export const metadata = {
  title: "Luna y Papel",
  description: "Papelería para estudiar y crear",
};

export default function LayoutPrincipal({ children }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <EncabezadoConRuta />
        <main className="container-lg contenido">{children}</main>
        <PiePagina />
      </body>
    </html>
  );
}
