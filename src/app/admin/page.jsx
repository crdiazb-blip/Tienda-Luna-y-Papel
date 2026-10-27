import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Boton from "../../components/Boton";
import Mensaje from "../../components/Mensaje";
import { obtenerProductos } from "../../utils/api";
import { resumirProductos } from "../../utils/resumenProductos";
import { formatearPesos } from "../../utils/calcularTotal";
import { nombreCookie, tokenValido } from "../../utils/sesion";
import { cerrarSesion } from "./acciones";

export default async function Admin() {
  const almacen = await cookies();
  if (!tokenValido(almacen.get(nombreCookie)?.value)) {
    redirect("/admin/login");
  }

  const productos = await obtenerProductos();
  const resumen = resumirProductos(productos);

  return (
    <>
      <section className="titulo">
        <p className="texto-pequeno">Administración</p>
        <h1>Panel de administrador</h1>
        <p>Resumen del catálogo que entrega la API. Es una vista de solo lectura.</p>
        <form action={cerrarSesion}>
          <Boton tipo="submit" variante="secundario">Cerrar sesión</Boton>
        </form>
      </section>

      <section className="px-4 py-8 md:px-8 md:py-12">
        {resumen === null ? (
          <Mensaje tipo="error">
            No se pudieron cargar los productos. Inicia la API con npm run api en otra terminal.
          </Mensaje>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <article className="border-l-4 border-dorado bg-white p-5">
                <p className="texto-pequeno">Productos</p>
                <p className="mb-0 text-3xl font-bold text-oliva">{resumen.total}</p>
              </article>
              <article className="border-l-4 border-dorado bg-white p-5">
                <p className="texto-pequeno">Precio promedio</p>
                <p className="mb-0 text-3xl font-bold text-oliva">{formatearPesos(resumen.promedio)}</p>
              </article>
              <article className="border-l-4 border-dorado bg-white p-5">
                <p className="texto-pequeno">Más caro</p>
                <p className="mb-0 text-xl font-bold text-oliva">{resumen.masCaro.nombre}</p>
                <p className="mb-0">{formatearPesos(resumen.masCaro.precio)}</p>
              </article>
              <article className="border-l-4 border-dorado bg-white p-5">
                <p className="texto-pequeno">Más barato</p>
                <p className="mb-0 text-xl font-bold text-oliva">{resumen.masBarato.nombre}</p>
                <p className="mb-0">{formatearPesos(resumen.masBarato.precio)}</p>
              </article>
            </div>

            <h2 className="mb-3 mt-10">Productos por categoría</h2>
            <ul className="flex flex-wrap gap-3">
              {resumen.categorias.map((categoria) => (
                <li className="bg-durazno px-4 py-2" key={categoria.nombre}>
                  {categoria.nombre}: <strong>{categoria.cantidad}</strong>
                </li>
              ))}
            </ul>

            <h2 className="mb-3 mt-10">Catálogo</h2>
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left">
                <thead className="bg-oliva text-white">
                  <tr>
                    <th className="px-4 py-3">Id</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr className="border-t border-[tan]" key={producto.id}>
                      <td className="px-4 py-3">{producto.id}</td>
                      <td className="px-4 py-3">{producto.nombre}</td>
                      <td className="px-4 py-3">{producto.categoria}</td>
                      <td className="px-4 py-3 text-right">{formatearPesos(producto.precio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
