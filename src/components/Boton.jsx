function Boton({ tipo = "button", variante = "principal", onClick, children }) {
  const clase = variante === "principal" ? "btn btn-luna" : "btn btn-secondary";
  return (
    <button type={tipo} className={clase} onClick={onClick}>
      {children}
    </button>
  );
}

export default Boton;
