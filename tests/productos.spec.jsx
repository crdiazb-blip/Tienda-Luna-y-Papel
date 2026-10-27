import { render, screen, cleanup } from "@testing-library/react";
import ListaProductos from "../src/components/ListaProductos";
import TarjetaProducto from "../src/components/TarjetaProducto";
import productos from "../api/productos.json";

QUnit.module("Productos (propiedades)", (hooks) => {
  hooks.afterEach(cleanup);

  QUnit.test("1. la lista muestra los cuatro productos con sus precios", (assert) => {
    render(<ListaProductos productos={productos} />);

    assert.equal(screen.getAllByRole("article").length, 4);
    assert.ok(screen.getByRole("heading", { name: "Cuaderno Punteado" }));
    assert.ok(screen.getByRole("heading", { name: "Set de Destacadores" }));
    assert.ok(screen.getByRole("heading", { name: "Planificador Semanal" }));
    assert.ok(screen.getByRole("heading", { name: "Estuche de Tela" }));
    assert.ok(screen.getByText("$6.990"));
    assert.ok(screen.getByText("$4.500"));
    assert.ok(screen.getByText("$5.990"));
    assert.ok(screen.getByText("$7.500"));
  });

  QUnit.test("2. una tarjeta muestra los datos que recibe por propiedades", (assert) => {
    const propsDePrueba = {
      id: "lapiz-de-prueba",
      nombre: "Lápiz de Prueba",
      categoria: "ESCRITURA",
      descripcion: "Descripción escrita solo para esta prueba.",
      precio: 1234,
    };

    render(<TarjetaProducto {...propsDePrueba} />);

    assert.ok(screen.getByRole("heading", { name: "Lápiz de Prueba" }));
    assert.ok(screen.getByText("ESCRITURA"));
    assert.ok(screen.getByText("Descripción escrita solo para esta prueba."));
    assert.ok(screen.getByText("$1.234"));
    assert.equal(screen.getByRole("link", { name: "Pedir" }).getAttribute("href"), "/pedido?producto=lapiz-de-prueba");
  });
});
