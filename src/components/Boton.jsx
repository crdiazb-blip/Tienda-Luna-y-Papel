function Boton({ tipo = "button", variante = "principal", onClick, children }) {
  const clase = variante === "principal" ? "boton" : "boton boton-gris";
  return (
    <button type={tipo} className={clase} onClick={onClick}>
      {children}
    </button>
  );
}

export default Boton;
