"use client";

import { useState } from "react";
import Boton from "./Boton";
import Mensaje from "./Mensaje";
import { validarPedido } from "../utils/validacionesPedido";
import { calcularTotal, formatearPesos } from "../utils/calcularTotal";
import { buscarProducto } from "../utils/productos";

const datosVacios = {
  nombre: "",
  correo: "",
  producto: "",
  cantidad: "1",
  comentario: "",
};

function FormularioPedido({ productos, productoInicial = "" }) {
  const [datos, setDatos] = useState({ ...datosVacios, producto: productoInicial });
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [resultado, setResultado] = useState(null);

  const errores = intentoEnvio ? validarPedido(datos, productos) : {};
  const hayErrores = Object.keys(errores).length > 0;

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
    setResultado(null);
  }

  function enviar(evento) {
    evento.preventDefault();
    setIntentoEnvio(true);
    const erroresActuales = validarPedido(datos, productos);
    if (Object.keys(erroresActuales).length > 0) {
      setResultado(null);
      return;
    }
    const producto = buscarProducto(productos, datos.producto);
    setResultado({
      nombreProducto: producto.nombre,
      cantidad: Number(datos.cantidad),
      total: calcularTotal(productos, datos.producto, datos.cantidad),
    });
  }

  function limpiar() {
    setDatos(datosVacios);
    setIntentoEnvio(false);
    setResultado(null);
  }

  function claseCampo(nombreCampo) {
    if (errores[nombreCampo]) {
      return "campo campo-invalido";
    }
    return intentoEnvio ? "campo campo-valido" : "campo";
  }
  return (
    <form className="border-t-[6px] border-dorado bg-white p-6" onSubmit={enviar} noValidate>
      <div className="mb-4">
        <label htmlFor="nombre" className="etiqueta">Nombre completo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className={claseCampo("nombre")}
          value={datos.nombre}
          onChange={cambiarCampo}
          autoComplete="name"
          placeholder="Ejemplo: Sofía Rojas"
          aria-invalid={errores.nombre ? "true" : "false"}
          aria-describedby={errores.nombre ? "error-nombre" : undefined}
        />
        {errores.nombre && <Mensaje tipo="campo" id="error-nombre">{errores.nombre}</Mensaje>}
      </div>

      <div className="mb-4">
        <label htmlFor="correo" className="etiqueta">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          name="correo"
          className={claseCampo("correo")}
          value={datos.correo}
          onChange={cambiarCampo}
          autoComplete="email"
          placeholder="nombre@correo.cl"
          aria-invalid={errores.correo ? "true" : "false"}
          aria-describedby={errores.correo ? "error-correo" : undefined}
        />
        {errores.correo && <Mensaje tipo="campo" id="error-correo">{errores.correo}</Mensaje>}
      </div>

      <div className="mb-4">
        <label htmlFor="producto" className="etiqueta">Producto</label>
        <select
          id="producto"
          name="producto"
          className={claseCampo("producto")}
          value={datos.producto}
          onChange={cambiarCampo}
          aria-invalid={errores.producto ? "true" : "false"}
          aria-describedby={errores.producto ? "error-producto" : undefined}
        >
          <option value="">Selecciona una opción</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre} - {formatearPesos(producto.precio)}
            </option>
          ))}
        </select>
        {errores.producto && <Mensaje tipo="campo" id="error-producto">{errores.producto}</Mensaje>}
      </div>

      <div className="mb-4">
        <label htmlFor="cantidad" className="etiqueta">Cantidad (de 1 a 10)</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          className={claseCampo("cantidad")}
          value={datos.cantidad}
          onChange={cambiarCampo}
          min="1"
          max="10"
          step="1"
          aria-invalid={errores.cantidad ? "true" : "false"}
          aria-describedby={errores.cantidad ? "error-cantidad" : undefined}
        />
        {errores.cantidad && <Mensaje tipo="campo" id="error-cantidad">{errores.cantidad}</Mensaje>}
      </div>

      <div className="mb-4">
        <label htmlFor="comentario" className="etiqueta">Comentario opcional</label>
        <textarea
          id="comentario"
          name="comentario"
          className="campo"
          rows="3"
          value={datos.comentario}
          onChange={cambiarCampo}
          placeholder="Color o indicación para el pedido"
        ></textarea>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Boton tipo="submit">Calcular total</Boton>
        <Boton variante="secundario" onClick={limpiar}>Limpiar</Boton>
      </div>

      <div aria-live="polite">
        {hayErrores && <Mensaje tipo="error">Revisa los campos marcados.</Mensaje>}
        {resultado && (
          <Mensaje tipo="exito">
            Tu pedido: {resultado.cantidad} × {resultado.nombreProducto}.
            {" "}Total: <strong>{formatearPesos(resultado.total)}</strong>.
            {" "}Por ahora solo calculamos el total: no se cobra nada, no te enviamos un correo
            y el pedido no queda guardado.
          </Mensaje>
        )}
      </div>
    </form>
  );
}

export default FormularioPedido;
