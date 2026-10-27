"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validarCredenciales } from "../../utils/credenciales";
import { crearToken, nombreCookie, tokenValido } from "../../utils/sesion";
import { guardarProductoEnApi, eliminarProductoEnApi } from "../../utils/api";
import { crearIdProducto, validarProductoNuevo } from "../../utils/validacionesProducto";

async function exigirSesion() {
  const almacen = await cookies();
  if (!tokenValido(almacen.get(nombreCookie)?.value)) {
    redirect("/admin/login");
  }
}

export async function iniciarSesion(formulario) {
  const usuario = formulario.get("usuario");
  const clave = formulario.get("clave");

  if (!validarCredenciales(usuario, clave)) {
    redirect("/admin/login?error=1");
  }

  const almacen = await cookies();
  almacen.set(nombreCookie, crearToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function cerrarSesion() {
  const almacen = await cookies();
  almacen.delete(nombreCookie);
  redirect("/admin/login");
}

export async function agregarProducto(formulario) {
  await exigirSesion();

  const datos = {
    nombre: String(formulario.get("nombre") ?? ""),
    categoria: String(formulario.get("categoria") ?? ""),
    descripcion: String(formulario.get("descripcion") ?? ""),
    precio: String(formulario.get("precio") ?? ""),
  };

  if (Object.keys(validarProductoNuevo(datos)).length > 0) {
    redirect("/admin?error=datos");
  }

  const estado = await guardarProductoEnApi({
    id: crearIdProducto(datos.nombre),
    nombre: datos.nombre.trim(),
    categoria: datos.categoria.trim().toUpperCase(),
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
  });

  if (estado === 201) {
    redirect("/admin?ok=agregado");
  }
  if (estado === 409) {
    redirect("/admin?error=duplicado");
  }
  redirect("/admin?error=api");
}

export async function eliminarProducto(formulario) {
  await exigirSesion();

  const estado = await eliminarProductoEnApi(String(formulario.get("id") ?? ""));

  if (estado === 200) {
    redirect("/admin?ok=eliminado");
  }
  if (estado === 404) {
    redirect("/admin?error=noexiste");
  }
  redirect("/admin?error=api");
}
