import { validarCantidad } from "../src/utils/validacionesPedido";
import { calcularTotal, formatearPesos } from "../src/utils/calcularTotal";

describe("Lógica del pedido", () => {
  it("7. la cantidad acepta enteros de 1 a 10 y rechaza fuera de rango, decimales y no numéricos", () => {
    const valoresCorrectos = ["1", "2", "5", "10", 3];
    const valoresIncorrectos = ["0", "11", "-1", "2.5", "", "abc"];

    valoresCorrectos.forEach((valor) => {
      expect(validarCantidad(valor)).toBe("");
    });
    valoresIncorrectos.forEach((valor) => {
      expect(validarCantidad(valor)).toBe("La cantidad debe ser un número entero entre 1 y 10.");
    });
  });

  it("8. el total es precio del catálogo × cantidad y se formatea en pesos chilenos", () => {
    const totalDosCuadernos = calcularTotal("cuaderno-punteado", 2);
    const totalTresEstuches = calcularTotal("estuche-tela", "3");
    const totalProductoInexistente = calcularTotal("producto-inventado", 1);

    expect(totalDosCuadernos).toBe(13980);
    expect(totalTresEstuches).toBe(22500);
    expect(totalProductoInexistente).toBeNull();
    expect(formatearPesos(13980)).toBe("$13.980");
  });
});
