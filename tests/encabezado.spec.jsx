import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Encabezado from "../src/components/Encabezado";
import Menu from "../src/components/Menu";

QUnit.module("Navegación (estado y propiedades)", (hooks) => {
  hooks.afterEach(cleanup);

  QUnit.test("3. el botón del encabezado abre y cierra el menú", (assert) => {
    render(<Encabezado rutaActual="/" />);
    const menu = document.getElementById("menu-principal");
    const boton = screen.getByRole("button", { name: "Mostrar u ocultar el menú" });
    assert.notOk(menu.classList.contains("show"));
    assert.equal(boton.getAttribute("aria-expanded"), "false");

    fireEvent.click(boton);
    assert.ok(menu.classList.contains("show"));
    assert.equal(boton.getAttribute("aria-expanded"), "true");

    fireEvent.click(boton);
    assert.notOk(menu.classList.contains("show"));
  });

  QUnit.test("4. el menú marca como activo el enlace de la ruta actual", (assert) => {
    render(<Menu rutaActual="/productos" />);

    const productos = screen.getByRole("link", { name: "Productos" });
    const inicio = screen.getByRole("link", { name: "Inicio" });
    assert.equal(productos.getAttribute("aria-current"), "page");
    assert.ok(productos.classList.contains("active"));
    assert.equal(inicio.getAttribute("aria-current"), null);
    assert.equal(screen.getByRole("link", { name: "Pedido" }).getAttribute("href"), "/pedido");
  });
});
