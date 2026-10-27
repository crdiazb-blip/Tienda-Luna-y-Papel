import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Boton from "../../components/Boton";
import Mensaje from "../../components/Mensaje";
import { obtenerProductos } from "../../utils/api";
import { resumirProductos } from "../../utils/resumenProductos";
import { formatearPesos } from "../../utils/calcularTotal";
import { nombreCookie, tokenValido } from "../../utils/sesion";
import { cerrarSesion, agregarProducto, eliminarProducto } from "./acciones";

const textosOk = {
  agregado: "Producto agregado.",
  eliminado: "Producto eliminado.",
};

const textosError = {
  datos: "Revisa los datos: el nombre, la categoría y la descripción no pueden ser muy cortos, y el precio debe ser un entero entre 1 y 1.000.000.",
  duplicado: "Ya existe un producto con ese nombre.",
  noexiste: "Ese producto ya no existe.",
  api: "No se pudo guardar el cambio. Revisa que la API esté encendida (npm run api).",
};

export default async function Admin({ searchParams }) {
  const almacen = await cookies();
  if (!tokenValido(almacen.get(nombreCookie)?.value)) {
    redirect("/admin/login");
  }

  const { ok, error } = await searchParams;
  const productos = await obtenerProductos();
  const resumen = productos === null ? null : resumirProductos(productos);

  return (
    <>
      <section className="titulo">
        <p className="texto-pequeno">Administración</p>
        <h1>Panel de administrador</h1>
        <p>Resumen del catálogo que entrega la API, con opción de agregar y eliminar productos.</p>
        <form action={cerrarSesion}>
          <Boton tipo="submit" variante="secundario">Cerrar sesión</Boton>
        </form>
      </section>

      <section className="px-4 py-8 md:px-8 md:py-12">
        <div aria-live="polite">
          {textosOk[ok] && <Mensaje tipo="exito">{textosOk[ok]}</Mensaje>}
          {textosError[error] && <Mensaje tipo="error">{textosError[error]}</Mensaje>}
        </div>

        {productos === null ? (
          <Mensaje tipo="error">
            No se pudieron cargar los productos. Inicia la API con npm run api en otra terminal.
          </Mensaje>
        ) : (
          <>
            {resumen === null ? (
              <p>No hay productos en el catálogo. Agrega el primero con el formulario de abajo.</p>
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
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto) => (
                        <tr className="border-t border-[tan]" key={producto.id}>
                          <td className="px-4 py-3">{producto.id}</td>
                          <td className="px-4 py-3">{producto.nombre}</td>
                          <td className="px-4 py-3">{producto.categoria}</td>
                          <td className="px-4 py-3 text-right">{formatearPesos(producto.precio)}</td>
                          <td className="px-4 py-3 text-right">
                            <form action={eliminarProducto}>
                              <input type="hidden" name="id" value={producto.id} />
                              <button
                                type="submit"
                                className="min-h-11 cursor-pointer bg-red-100 px-3 py-2 font-bold text-red-900 hover:bg-red-200"
                                aria-label={"Eliminar " + producto.nombre}
                              >
                                Eliminar
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <h2 className="mb-3 mt-10">Agregar producto</h2>
            <form action={agregarProducto} className="border-t-[6px] border-dorado bg-white p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="etiqueta">Nombre</label>
                  <input id="nombre" name="nombre" type="text" className="campo" maxLength={60} required />
                </div>
                <div>
                  <label htmlFor="categoria" className="etiqueta">Categoría</label>
                  <input id="categoria" name="categoria" type="text" className="campo" maxLength={30} required />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="descripcion" className="etiqueta">Descripción</label>
                  <input id="descripcion" name="descripcion" type="text" className="campo" maxLength={120} required />
                </div>
                <div>
                  <label htmlFor="precio" className="etiqueta">Precio (pesos, número entero)</label>
                  <input id="precio" name="precio" type="number" min="1" max="1000000" step="1" className="campo" required />
                </div>
              </div>
              <div className="mt-4">
                <Boton tipo="submit">Agregar producto</Boton>
              </div>
            </form>
          </>
        )}
      </section>
    </>
  );
}
