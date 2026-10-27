import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import ListaProductos from "../src/components/ListaProductos";
import TarjetaProducto from "../src/components/TarjetaProducto";
import { productos } from "../src/data/productos";

describe("Productos (propiedades y eventos)", () => {
  it("1. la lista muestra los cuatro productos del catálogo con sus precios", () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={productos} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("article").length).toBe(4);
    expect(screen.getByRole("heading", { name: "Cuaderno Punteado" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Set de Destacadores" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Planificador Semanal" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Estuche de Tela" })).toBeTruthy();
    expect(screen.getByText("$6.990")).toBeTruthy();
    expect(screen.getByText("$4.500")).toBeTruthy();
    expect(screen.getByText("$5.990")).toBeTruthy();
    expect(screen.getByText("$7.500")).toBeTruthy();
  });

  it("2. una tarjeta muestra los datos que recibe por propiedades", () => {
    const propsDePrueba = {
      id: "lapiz-de-prueba",
      nombre: "Lápiz de Prueba",
      categoria: "ESCRITURA",
      descripcion: "Descripción escrita solo para esta prueba.",
      precio: 1234,
    };

    render(
      <MemoryRouter>
        <TarjetaProducto {...propsDePrueba} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Lápiz de Prueba" })).toBeTruthy();
    expect(screen.getByText("ESCRITURA")).toBeTruthy();
    expect(screen.getByText("Descripción escrita solo para esta prueba.")).toBeTruthy();
    expect(screen.getByText("$1.234")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Pedir" }).getAttribute("href")).toBe(
      "/pedido?producto=lapiz-de-prueba"
    );
  });

  it("3. pulsar «Pedir» en Productos abre el formulario con ese producto elegido", () => {
    render(
      <MemoryRouter initialEntries={["/productos"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Productos disponibles" })).toBeTruthy();

    const botonesPedir = screen.getAllByRole("link", { name: "Pedir" });
    fireEvent.click(botonesPedir[1]);

    expect(screen.getByRole("heading", { name: "Solicita tu pedido" })).toBeTruthy();
    expect(screen.getByLabelText("Producto").value).toBe("set-destacadores");
  });
});
