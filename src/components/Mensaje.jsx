function Mensaje({ tipo, id, children }) {
  const clases = {
    campo: "mt-1 text-sm text-error",
    error: "my-3 border border-red-300 bg-red-100 p-3 text-red-900",
    exito: "my-3 border border-green-300 bg-green-100 p-3 text-green-900",
  };
  return (
    <p id={id} className={clases[tipo]}>
      {children}
    </p>
  );
}

export default Mensaje;
