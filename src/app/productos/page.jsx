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

      <section className="px-4 py-8 md:px-8 md:py-12">
        {productos === null && (
          <Mensaje tipo="error">
            No se pudieron cargar los productos. Inicia la API con npm run api en otra terminal.
          </Mensaje>
        )}
        {productos !== null && productos.length === 0 && <p>Por ahora no hay productos disponibles.</p>}
        {productos !== null && productos.length > 0 && <ListaProductos productos={productos} />}
      </section>

      <section className="mb-4 bg-white">
        <div className="grid items-center md:grid-cols-2">
          <img
            className="h-[300px] w-full object-cover"
            src="/imagenes/cuaderno.jpg"
            alt="Cuaderno abierto acompañado de lápices"
          />
          <div className="p-6">
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
