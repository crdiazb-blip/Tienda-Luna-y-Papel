import { buscarProducto } from "./productos";

export function validarNombre(nombre) {
  if (nombre.trim().length < 3) {
    return "Escribe tu nombre completo (mínimo 3 letras).";
  }
  return "";
}

export function validarCorreo(correo) {
  const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatoBasico.test(correo.trim())) {
    return "Escribe un correo válido, por ejemplo nombre@correo.cl.";
  }
  return "";
}

export function validarProducto(productos, idProducto) {
  if (idProducto === "") {
    return "Selecciona un producto.";
  }
  if (!buscarProducto(productos, idProducto)) {
    return "El producto elegido no está en el catálogo.";
  }
  return "";
}

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

export function validarPedido(datos, productos) {
  const errores = {
    nombre: validarNombre(datos.nombre),
    correo: validarCorreo(datos.correo),
    producto: validarProducto(productos, datos.producto),
    cantidad: validarCantidad(datos.cantidad),
  };
  Object.keys(errores).forEach((campo) => {
    if (errores[campo] === "") {
      delete errores[campo];
    }
  });
  return errores;
}
