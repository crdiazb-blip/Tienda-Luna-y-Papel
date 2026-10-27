import { useState } from "react";
import Boton from "./Boton";
import Mensaje from "./Mensaje";
import { validarPedido } from "../utils/validacionesPedido";
import { calcularTotal, formatearPesos } from "../utils/calcularTotal";
import { buscarProducto } from "../data/productos";

// Valores con los que parte (y vuelve a partir) el formulario.
const datosVacios = {
  nombre: "",
  correo: "",
  producto: "",
  cantidad: "1",
  comentario: "",
};

// Props:
//   productos        -> arreglo del catálogo, se usa para las opciones del select
//   productoInicial  -> id del producto que viene preseleccionado (por ejemplo desde "Pedir")
function FormularioPedido({ productos, productoInicial = "" }) {
  // ESTADO 1: lo que el usuario ha escrito. Cada campo es "controlado":
  // su valor sale del estado y cada cambio actualiza el estado.
  const [datos, setDatos] = useState({ ...datosVacios, producto: productoInicial });
  // ESTADO 2: ¿el usuario ya intentó enviar? Los errores solo se muestran después del primer intento.
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  // ESTADO 3: el resultado correcto (o null si todavía no hay).
  const [resultado, setResultado] = useState(null);

  // Los errores NO se guardan en un estado: se calculan cada vez que se dibuja el formulario.
  // Así, cuando el usuario corrige un campo, su mensaje desaparece solo.
  const errores = intentoEnvio ? validarPedido(datos) : {};
  const hayErrores = Object.keys(errores).length > 0;

  // Se ejecuta con cada tecla o cambio en cualquier campo.
  // "name" del campo coincide con la clave del estado (nombre, correo, producto...).
  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
    setResultado(null); // el total anterior ya no corresponde a los datos nuevos
  }

  function enviar(evento) {
    evento.preventDefault(); // evita que el navegador recargue la página
    setIntentoEnvio(true);
    const erroresActuales = validarPedido(datos);
    if (Object.keys(erroresActuales).length > 0) {
      setResultado(null);
      return;
    }
    const producto = buscarProducto(datos.producto);
    setResultado({
      nombreProducto: producto.nombre,
      cantidad: Number(datos.cantidad),
      total: calcularTotal(datos.producto, datos.cantidad),
    });
  }

  function limpiar() {
    setDatos(datosVacios);
    setIntentoEnvio(false);
    setResultado(null);
  }

  // Devuelve la clase de Bootstrap según el estado del campo:
  // is-invalid (rojo) si tiene error, is-valid (verde) si ya se intentó enviar y está bien.
  // "base" es la clase de Bootstrap del tipo de campo (form-control o form-select).
  function claseCampo(nombreCampo, base = "form-control") {
    if (errores[nombreCampo]) {
      return base + " is-invalid";
    }
    return intentoEnvio ? base + " is-valid" : base;
  }

  return (
    <form className="formulario-pedido" onSubmit={enviar} noValidate>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre completo</label>
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

      <div className="mb-3">
        <label htmlFor="correo" className="form-label">Correo electrónico</label>
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

      <div className="mb-3">
        <label htmlFor="producto" className="form-label">Producto</label>
        <select
          id="producto"
          name="producto"
          className={claseCampo("producto", "form-select")}
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

      <div className="mb-3">
        <label htmlFor="cantidad" className="form-label">Cantidad (de 1 a 10)</label>
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

      <div className="mb-3">
        <label htmlFor="comentario" className="form-label">Comentario opcional</label>
        <textarea
          id="comentario"
          name="comentario"
          className="form-control"
          rows="3"
          value={datos.comentario}
          onChange={cambiarCampo}
          placeholder="Color o indicación para el pedido"
        ></textarea>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Boton tipo="submit">Calcular total</Boton>
        <Boton variante="secundario" onClick={limpiar}>Limpiar</Boton>
      </div>

      {/* Zona anunciada por lectores de pantalla cuando cambia (aria-live) */}
      <div aria-live="polite">
        {hayErrores && <Mensaje tipo="error">Revisa los campos marcados.</Mensaje>}
        {resultado && (
          <Mensaje tipo="exito">
            Cálculo de demostración: {resultado.cantidad} × {resultado.nombreProducto}.
            {" "}Total: <strong>{formatearPesos(resultado.total)}</strong>.
            {" "}Este formulario es solo una demostración académica: no se realizó ningún cobro,
            no se envió ningún correo y el pedido no se guardó.
          </Mensaje>
        )}
      </div>
    </form>
  );
}

export default FormularioPedido;
