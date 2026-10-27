import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import FormularioPedido from "../src/components/FormularioPedido";
import productos from "../api/productos.json";

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function llenarDatosCorrectos() {
  escribir("Nombre completo", "Sofía Rojas");
  escribir("Correo electrónico", "sofia@correo.cl");
  escribir("Producto", "cuaderno-punteado");
  escribir(/Cantidad/, "2");
  escribir("Comentario opcional", "Con cubierta azul");
}

function pulsarCalcular() {
  fireEvent.click(screen.getByRole("button", { name: "Calcular total" }));
}

QUnit.module("Formulario de pedido (estado, validación y resultado)", (hooks) => {
  hooks.beforeEach(() => {
    render(<FormularioPedido productos={productos} />);
  });
  hooks.afterEach(cleanup);

  QUnit.test("5. un campo controlado cambia su valor al escribir y no muestra errores antes de enviar", (assert) => {
    const campoNombre = screen.getByLabelText("Nombre completo");
    assert.equal(campoNombre.value, "");

    escribir("Nombre completo", "Sofía Rojas");

    assert.equal(campoNombre.value, "Sofía Rojas");
    assert.equal(screen.queryByText("Revisa los campos marcados."), null);
  });

  QUnit.test("6. un formulario inválido muestra errores, no muestra total y el error se quita al corregir", (assert) => {
    pulsarCalcular();

    assert.ok(screen.getByText("Escribe tu nombre completo (mínimo 3 letras)."));
    assert.ok(screen.getByText("Escribe un correo válido, por ejemplo nombre@correo.cl."));
    assert.ok(screen.getByText("Selecciona un producto."));
    assert.ok(screen.getByText("Revisa los campos marcados."));
    assert.equal(screen.getByLabelText("Nombre completo").getAttribute("aria-invalid"), "true");
    assert.equal(screen.queryByText(/Cálculo de demostración/), null);

    escribir("Nombre completo", "Sofía Rojas");
    assert.equal(screen.queryByText("Escribe tu nombre completo (mínimo 3 letras)."), null);
    assert.ok(screen.getByText("Selecciona un producto."));
  });

  QUnit.test("9. un formulario válido muestra el total correcto y el mensaje de demostración", (assert) => {
    llenarDatosCorrectos();
    pulsarCalcular();

    const resultado = screen.getByText(/Cálculo de demostración/);
    assert.ok(resultado.textContent.includes("2 × Cuaderno Punteado"));
    assert.ok(resultado.textContent.includes("Total: $13.980"));
    assert.ok(resultado.textContent.includes("no se realizó ningún cobro"));
    assert.equal(screen.queryByText("Revisa los campos marcados."), null);
  });

  QUnit.test("10. «Limpiar» restablece campos, cantidad, errores y resultado", (assert) => {
    function verificarFormularioEnBlanco() {
      assert.equal(screen.getByLabelText("Nombre completo").value, "");
      assert.equal(screen.getByLabelText("Correo electrónico").value, "");
      assert.equal(screen.getByLabelText("Producto").value, "");
      assert.equal(screen.getByLabelText(/Cantidad/).value, "1");
      assert.equal(screen.getByLabelText("Comentario opcional").value, "");
      assert.equal(screen.queryByText(/Cálculo de demostración/), null);
      assert.equal(screen.queryByText("Revisa los campos marcados."), null);
    }

    llenarDatosCorrectos();
    pulsarCalcular();
    assert.ok(screen.getByText(/Cálculo de demostración/));
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    verificarFormularioEnBlanco();

    escribir("Nombre completo", "Ana");
    pulsarCalcular();
    assert.ok(screen.getByText("Selecciona un producto."));
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    verificarFormularioEnBlanco();
    assert.equal(screen.queryByText("Selecciona un producto."), null);
  });
});
