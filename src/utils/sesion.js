import { createHmac, timingSafeEqual } from "node:crypto";
import { usuarioAdmin } from "./credenciales";

export const nombreCookie = "sesion_admin";

const secreto = process.env.SECRETO_SESION || "secreto-solo-para-desarrollo";

export function crearToken() {
  return createHmac("sha256", secreto).update(usuarioAdmin).digest("hex");
}

export function tokenValido(token) {
  if (typeof token !== "string") {
    return false;
  }
  const esperado = Buffer.from(crearToken());
  const recibido = Buffer.from(token);
  return recibido.length === esperado.length && timingSafeEqual(recibido, esperado);
}
