import { validarCantidad } from "../src/utils/validacionesPedido";
import { calcularTotal, formatearPesos } from "../src/utils/calcularTotal";

// Pruebas de funciones puras: se les entregan valores concretos y se revisa lo que devuelven.
// Una lista de valores de entrada NO es un mock; es el dato que recibe la función real.

describe("Lógica del pedido", () => {
  it("7. la cantidad acepta enteros de 1 a 10 y rechaza fuera de rango, decimales y no numéricos", () => {
    // Preparar
    const valoresCorrectos = ["1", "2", "5", "10", 3];
    const valoresIncorrectos = ["0", "11", "-1", "2.5", "", "abc"];

    // Ejecutar y comprobar: "" significa "sin error"
    valoresCorrectos.forEach((valor) => {
      expect(validarCantidad(valor)).toBe("");
    });
    valoresIncorrectos.forEach((valor) => {
      expect(validarCantidad(valor)).toBe("La cantidad debe ser un número entero entre 1 y 10.");
    });
  });

  it("8. el total es precio del catálogo × cantidad y se formatea en pesos chilenos", () => {
    // Preparar y ejecutar con productos reales del catálogo
    const totalDosCuadernos = calcularTotal("cuaderno-punteado", 2); // 6990 × 2
    const totalTresEstuches = calcularTotal("estuche-tela", "3"); // 7500 × 3 (la cantidad llega como texto)
    const totalProductoInexistente = calcularTotal("producto-inventado", 1);

    // Comprobar
    expect(totalDosCuadernos).toBe(13980);
    expect(totalTresEstuches).toBe(22500);
    expect(totalProductoInexistente).toBeNull();
    expect(formatearPesos(13980)).toBe("$13.980");
  });
});
