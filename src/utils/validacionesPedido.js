import { buscarProducto } from "../data/productos";

// Cada función devuelve un texto de error, o "" cuando el dato es correcto.

export function validarNombre(nombre) {
  if (nombre.trim().length < 3) {
    return "Escribe tu nombre completo (mínimo 3 letras).";
  }
  return "";
}

// Formato básico: algo, una @, algo, un punto y algo; sin espacios. Ej: ana@correo.cl
export function validarCorreo(correo) {
  const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatoBasico.test(correo.trim())) {
    return "Escribe un correo válido, por ejemplo nombre@correo.cl.";
  }
  return "";
}

// El producto debe estar elegido y existir en el catálogo.
export function validarProducto(idProducto) {
  if (idProducto === "") {
    return "Selecciona un producto.";
  }
  if (!buscarProducto(idProducto)) {
    return "El producto elegido no está en el catálogo.";
  }
  return "";
}

// La cantidad llega como texto desde el campo. Solo acepta enteros del 1 al 10.
// El patrón /^\d+$/ rechaza vacío, decimales ("2.5"), negativos ("-1") y letras.
export function validarCantidad(cantidad) {
  const texto = String(cantidad).trim();
  if (!/^\d+$/.test(texto)) {
    return "La cantidad debe ser un número entero entre 1 y 10.";
  }
  const numero = Number(texto);
  if (numero < 1 || numero > 10) {
    return "La cantidad debe ser un número entero entre 1 y 10.";
  }
  return "";
}

// Revisa todos los campos y devuelve un objeto solo con los que tienen error.
// Ejemplo: { nombre: "Escribe tu nombre...", cantidad: "La cantidad..." }
export function validarPedido(datos) {
  const errores = {
    nombre: validarNombre(datos.nombre),
    correo: validarCorreo(datos.correo),
    producto: validarProducto(datos.producto),
    cantidad: validarCantidad(datos.cantidad),
  };
  Object.keys(errores).forEach((campo) => {
    if (errores[campo] === "") {
      delete errores[campo];
    }
  });
  return errores;
}
