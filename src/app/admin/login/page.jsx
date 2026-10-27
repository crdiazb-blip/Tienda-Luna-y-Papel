import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Boton from "../../../components/Boton";
import Mensaje from "../../../components/Mensaje";
import { nombreCookie, tokenValido } from "../../../utils/sesion";
import { iniciarSesion } from "../acciones";

export default async function Login({ searchParams }) {
  const almacen = await cookies();
  if (tokenValido(almacen.get(nombreCookie)?.value)) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <>
      <section className="titulo">
        <p className="texto-pequeno">Administración</p>
        <h1>Iniciar sesión</h1>
        <p>Solo para quienes administran la tienda.</p>
      </section>

      <section className="mx-auto max-w-md px-4 py-8 md:py-12">
        <form action={iniciarSesion} className="border-t-[6px] border-dorado bg-white p-6">
          <div className="mb-4">
            <label htmlFor="usuario" className="etiqueta">Usuario</label>
            <input id="usuario" name="usuario" type="text" className="campo" autoComplete="username" required />
          </div>
          <div className="mb-4">
            <label htmlFor="clave" className="etiqueta">Contraseña</label>
            <input id="clave" name="clave" type="password" className="campo" autoComplete="current-password" required />
          </div>
          <Boton tipo="submit">Entrar</Boton>
          {error && <Mensaje tipo="error">Usuario o contraseña incorrectos.</Mensaje>}
        </form>
      </section>
    </>
  );
}
