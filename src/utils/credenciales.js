export const usuarioAdmin = "admin";
export const claveAdmin = "1234";

export function validarCredenciales(usuario, clave) {
  return usuario === usuarioAdmin && clave === claveAdmin;
}
