import ListaProductos from "../../components/ListaProductos";
import Mensaje from "../../components/Mensaje";
import { obtenerProductos } from "../../utils/api";

export default async function Productos() {
  const productos = await obtenerProductos();

  return (
    <>
      <section className="titulo">
        <p className="texto-pequeno">Catálogo</p>
        <h1>Productos disponibles</h1>
        <p>Selecciona tu favorito y solicítalo desde nuestro formulario.</p>
      </section>

      <section className="py-4 py-md-5 px-3 px-md-4">
        {productos.length > 0 ? (
          <ListaProductos productos={productos} />
        ) : (
          <Mensaje tipo="error">
            No se pudieron cargar los productos. Inicia la API con npm run api en otra terminal.
          </Mensaje>
        )}
      </section>

      <section className="detalle mb-4">
        <div className="row g-0 align-items-center">
          <div className="col-md-6">
            <img
              className="img-fluid w-100 imagen-detalle"
              src="/imagenes/cuaderno.jpg"
              alt="Cuaderno abierto acompañado de lápices"
            />
          </div>
          <div className="col-md-6 p-4">
            <h2>Productos pensados para el uso diario</h2>
            <p>
              Elegimos artículos prácticos y fáciles de combinar para estudiar, trabajar y
              desarrollar proyectos personales.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
