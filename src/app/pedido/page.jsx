import FormularioPedido from "../../components/FormularioPedido";
import Mensaje from "../../components/Mensaje";
import { obtenerProductos } from "../../utils/api";
import { buscarProducto } from "../../utils/productos";

export default async function Pedido({ searchParams }) {
  const { producto } = await searchParams;
  const productos = await obtenerProductos();
  const productoInicial = buscarProducto(productos, producto) ? producto : "";

  return (
    <>
      <section className="titulo">
        <p className="texto-pequeno">Pedido de demostración</p>
        <h1>Solicita tu pedido</h1>
        <p>Completa los datos y revisa el total calculado.</p>
      </section>

      <section className="px-4 py-8 md:px-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {productos.length > 0 ? (
              <FormularioPedido productos={productos} productoInicial={productoInicial} />
            ) : (
              <Mensaje tipo="error">
                No se pudieron cargar los productos. Inicia la API con npm run api en otra terminal.
              </Mensaje>
            )}
          </div>
          <aside className="bg-durazno p-6">
            <h2 className="text-xl">Información de compra</h2>
            <p>El formulario calcula el valor según el producto y la cantidad.</p>
            <p>Retiro: Avenida Irarrázaval 1800, Ñuñoa.</p>
            <p className="mb-0">Horario: lunes a sábado, de 10:00 a 18:00.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
