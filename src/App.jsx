import { Routes, Route } from "react-router-dom";
import Encabezado from "./components/Encabezado";
import PiePagina from "./components/PiePagina";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Pedido from "./pages/Pedido";

// App arma la página: encabezado fijo, la sección que corresponde a la dirección, y pie de página.
// El enrutador (BrowserRouter) se coloca afuera, en main.jsx; así las pruebas pueden
// montar App con otro enrutador y elegir en qué dirección comienza.
function App() {
  return (
    <>
      <Encabezado />
      <main className="container-lg contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/pedido" element={<Pedido />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}

export default App;
