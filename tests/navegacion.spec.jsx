import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

describe("Navegación", () => {
  it("4. el menú lleva a la sección elegida y marca el enlace activo", () => {
    // Preparar: aplicación completa comenzando en Inicio
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Ordena tus ideas con estilo" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBe("page");

    // Ejecutar: clic en «Productos» del menú
    fireEvent.click(screen.getByRole("link", { name: "Productos" }));

    // Comprobar: cambia la sección visible y el enlace activo del menú
    expect(screen.getByRole("heading", { name: "Productos disponibles" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Ordena tus ideas con estilo" })).toBeNull();
    expect(screen.getByRole("link", { name: "Productos" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBeNull();
  });
});
