import { render, screen, fireEvent } from "@testing-library/react";
import FormularioPedido from "../src/components/FormularioPedido";
import { productos } from "../src/data/productos";

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

describe("Formulario de pedido (estado, validación y resultado)", () => {
  beforeEach(() => {
    render(<FormularioPedido productos={productos} />);
  });

  it("5. un campo controlado cambia su valor al escribir y no muestra errores antes de enviar", () => {
    const campoNombre = screen.getByLabelText("Nombre completo");
    expect(campoNombre.value).toBe("");

    escribir("Nombre completo", "Sofía Rojas");

    expect(campoNombre.value).toBe("Sofía Rojas");
    expect(screen.queryByText("Revisa los campos marcados.")).toBeNull();
  });

  it("6. un formulario inválido muestra errores, no muestra total y el error se quita al corregir", () => {
    pulsarCalcular();

    expect(screen.getByText("Escribe tu nombre completo (mínimo 3 letras).")).toBeTruthy();
    expect(screen.getByText("Escribe un correo válido, por ejemplo nombre@correo.cl.")).toBeTruthy();
    expect(screen.getByText("Selecciona un producto.")).toBeTruthy();
    expect(screen.getByText("Revisa los campos marcados.")).toBeTruthy();
    expect(screen.getByLabelText("Nombre completo").getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByText(/Cálculo de demostración/)).toBeNull();

    escribir("Nombre completo", "Sofía Rojas");
    expect(screen.queryByText("Escribe tu nombre completo (mínimo 3 letras).")).toBeNull();
    expect(screen.getByText("Selecciona un producto.")).toBeTruthy();
  });

  it("9. un formulario válido muestra el total correcto y el mensaje de demostración", () => {
    llenarDatosCorrectos();
    pulsarCalcular();

    const resultado = screen.getByText(/Cálculo de demostración/);
    expect(resultado.textContent).toContain("2 × Cuaderno Punteado");
    expect(resultado.textContent).toContain("Total: $13.980");
    expect(resultado.textContent).toContain("no se realizó ningún cobro");
    expect(screen.queryByText("Revisa los campos marcados.")).toBeNull();
  });

  it("10. «Limpiar» restablece campos, cantidad, errores y resultado", () => {
    const verificarFormularioEnBlanco = () => {
      expect(screen.getByLabelText("Nombre completo").value).toBe("");
      expect(screen.getByLabelText("Correo electrónico").value).toBe("");
      expect(screen.getByLabelText("Producto").value).toBe("");
      expect(screen.getByLabelText(/Cantidad/).value).toBe("1");
      expect(screen.getByLabelText("Comentario opcional").value).toBe("");
      expect(screen.queryByText(/Cálculo de demostración/)).toBeNull();
      expect(screen.queryByText("Revisa los campos marcados.")).toBeNull();
    };

    llenarDatosCorrectos();
    pulsarCalcular();
    expect(screen.getByText(/Cálculo de demostración/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    verificarFormularioEnBlanco();

    escribir("Nombre completo", "Ana");
    pulsarCalcular();
    expect(screen.getByText("Selecciona un producto.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    verificarFormularioEnBlanco();
    expect(screen.queryByText("Selecciona un producto.")).toBeNull();
  });
});
