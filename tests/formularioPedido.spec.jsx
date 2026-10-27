import { render, screen, fireEvent } from "@testing-library/react";
import FormularioPedido from "../src/components/FormularioPedido";
import { productos } from "../src/data/productos";

// Ayudas para no repetir código en las pruebas.
// fireEvent.change simula que el usuario escribe/elige un valor; fireEvent.click, que pulsa un botón.
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
    // El formulario real, con el catálogo real, sin tocar nada de su lógica
    render(<FormularioPedido productos={productos} />);
  });

  it("5. un campo controlado cambia su valor al escribir y no muestra errores antes de enviar", () => {
    const campoNombre = screen.getByLabelText("Nombre completo");
    expect(campoNombre.value).toBe("");

    // Ejecutar: escribir en el campo
    escribir("Nombre completo", "Sofía Rojas");

    // Comprobar: el valor mostrado viene del estado de React y aún no hay errores
    expect(campoNombre.value).toBe("Sofía Rojas");
    expect(screen.queryByText("Revisa los campos marcados.")).toBeNull();
  });

  it("6. un formulario inválido muestra errores, no muestra total y el error se quita al corregir", () => {
    // Ejecutar: enviar con todo vacío (la cantidad ya parte en 1)
    pulsarCalcular();

    // Comprobar: errores junto a cada campo, aviso general y ningún resultado
    expect(screen.getByText("Escribe tu nombre completo (mínimo 3 letras).")).toBeTruthy();
    expect(screen.getByText("Escribe un correo válido, por ejemplo nombre@correo.cl.")).toBeTruthy();
    expect(screen.getByText("Selecciona un producto.")).toBeTruthy();
    expect(screen.getByText("Revisa los campos marcados.")).toBeTruthy();
    expect(screen.getByLabelText("Nombre completo").getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByText(/Cálculo de demostración/)).toBeNull();

    // Corregir solo el nombre: su mensaje desaparece y los demás siguen
    escribir("Nombre completo", "Sofía Rojas");
    expect(screen.queryByText("Escribe tu nombre completo (mínimo 3 letras).")).toBeNull();
    expect(screen.getByText("Selecciona un producto.")).toBeTruthy();
  });

  it("9. un formulario válido muestra el total correcto y el mensaje de demostración", () => {
    // Preparar y ejecutar: 2 cuadernos de $6.990
    llenarDatosCorrectos();
    pulsarCalcular();

    // Comprobar: total = 6990 × 2 = $13.980, aviso de que no hay cobro y sin errores
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

    // Caso A: había un resultado correcto en pantalla
    llenarDatosCorrectos();
    pulsarCalcular();
    expect(screen.getByText(/Cálculo de demostración/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    verificarFormularioEnBlanco();

    // Caso B: había errores en pantalla
    escribir("Nombre completo", "Ana");
    pulsarCalcular();
    expect(screen.getByText("Selecciona un producto.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    verificarFormularioEnBlanco();
    expect(screen.queryByText("Selecciona un producto.")).toBeNull();
  });
});
