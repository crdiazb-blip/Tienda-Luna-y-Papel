// Mensaje reutilizable para errores de campo, avisos y resultados.
//   tipo -> "campo" (error pequeño bajo un campo), "error" (aviso rojo) o "exito" (aviso verde)
//   id   -> permite enlazar el mensaje con su campo mediante aria-describedby
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
