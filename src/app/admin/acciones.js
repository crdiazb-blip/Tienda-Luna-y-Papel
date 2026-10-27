"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validarCredenciales } from "../../utils/credenciales";
import { crearToken, nombreCookie } from "../../utils/sesion";

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
