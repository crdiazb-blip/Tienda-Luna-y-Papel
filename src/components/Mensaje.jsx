function Mensaje({ tipo, id, children }) {
  const clases = {
    campo: "mensaje-campo",
    error: "alert alert-danger",
    exito: "alert alert-success",
  };
  return (
    <p id={id} className={clases[tipo]}>
      {children}
    </p>
  );
}

export default Mensaje;
