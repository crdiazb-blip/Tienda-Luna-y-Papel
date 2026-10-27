// Botón reutilizable. Recibe sus datos por propiedades (props):
//   tipo     -> "button" o "submit"
//   variante -> "principal" (dorado) o "secundario" (gris)
//   onClick  -> función que se ejecuta al pulsar
//   children -> el texto que se muestra dentro del botón
function Boton({ tipo = "button", variante = "principal", onClick, children }) {
  const clase = variante === "principal" ? "btn btn-luna" : "btn btn-secondary";
  return (
    <button type={tipo} className={clase} onClick={onClick}>
      {children}
    </button>
  );
}

export default Boton;
