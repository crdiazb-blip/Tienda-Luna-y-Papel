import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Primero Bootstrap y después el CSS propio, para que nuestros colores tengan prioridad.
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/estilos.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
