import { Routes, Route } from "react-router-dom";
import Encabezado from "./components/Encabezado";
import PiePagina from "./components/PiePagina";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Pedido from "./pages/Pedido";

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
