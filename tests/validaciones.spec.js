import { validarCantidad } from "../src/utils/validacionesPedido";
import { calcularTotal, formatearPesos } from "../src/utils/calcularTotal";
import { resumirProductos } from "../src/utils/resumenProductos";
import { validarCredenciales } from "../src/utils/credenciales";
import { validarProductoNuevo, crearIdProducto } from "../src/utils/validacionesProducto";
import productos from "../api/productos.json";

QUnit.module("Lógica del pedido", () => {
  QUnit.test("7. la cantidad acepta enteros de 1 a 10 y rechaza fuera de rango, decimales y no numéricos", (assert) => {
    const valoresCorrectos = ["1", "2", "5", "10", 3];
    const valoresIncorrectos = ["0", "11", "-1", "2.5", "", "abc"];

    valoresCorrectos.forEach((valor) => {
      assert.equal(validarCantidad(valor), "");
    });
    valoresIncorrectos.forEach((valor) => {
      assert.equal(validarCantidad(valor), "La cantidad debe ser un número entero entre 1 y 10.");
    });
  });

  QUnit.test("8. el total es precio del catálogo × cantidad y se formatea en pesos chilenos", (assert) => {
    const totalDosCuadernos = calcularTotal(productos, "cuaderno-punteado", 2);
    const totalTresEstuches = calcularTotal(productos, "estuche-tela", "3");
    const totalProductoInexistente = calcularTotal(productos, "producto-inventado", 1);

    assert.equal(totalDosCuadernos, 13980);
    assert.equal(totalTresEstuches, 22500);
    assert.strictEqual(totalProductoInexistente, null);
    assert.equal(formatearPesos(13980), "$13.980");
  });

  QUnit.test("11. el resumen del panel calcula total, promedio, extremos y categorías", (assert) => {
    const resumen = resumirProductos(productos);

    assert.equal(resumen.total, 4);
    assert.equal(resumen.promedio, 6245);
    assert.equal(resumen.masCaro.nombre, "Estuche de Tela");
    assert.equal(resumen.masBarato.nombre, "Set de Destacadores");
    assert.equal(resumen.categorias.length, 4);
    assert.deepEqual(resumen.categorias[0], { nombre: "CUADERNOS", cantidad: 1 });
    assert.strictEqual(resumirProductos([]), null);
  });

  QUnit.test("12. el inicio de sesión acepta solo admin con clave 1234", (assert) => {
    assert.strictEqual(validarCredenciales("admin", "1234"), true);
    assert.strictEqual(validarCredenciales("admin", "12345"), false);
    assert.strictEqual(validarCredenciales("Admin", "1234"), false);
    assert.strictEqual(validarCredenciales("otro", "1234"), false);
    assert.strictEqual(validarCredenciales("", ""), false);
    assert.strictEqual(validarCredenciales(null, null), false);
  });

  QUnit.test("13. la validación del producto nuevo acepta datos correctos y rechaza datos inválidos", (assert) => {
    const correcto = { nombre: "Regla de 30 cm", categoria: "Accesorios", descripcion: "Regla transparente de plástico.", precio: "1990" };
    assert.deepEqual(validarProductoNuevo(correcto), {});

    const vacio = validarProductoNuevo({ nombre: "", categoria: "", descripcion: "", precio: "" });
    assert.deepEqual(Object.keys(vacio), ["nombre", "categoria", "descripcion", "precio"]);

    ["0", "-5", "12.5", "abc", "1000001"].forEach((precio) => {
      assert.ok(validarProductoNuevo({ ...correcto, precio }).precio, "precio " + precio + " rechazado");
    });
    assert.ok(validarProductoNuevo({ ...correcto, nombre: "!!!" }).nombre);
  });

  QUnit.test("14. el id del producto se arma con el nombre, sin tildes, mayúsculas ni símbolos", (assert) => {
    assert.equal(crearIdProducto("Cuaderno Punteado"), "cuaderno-punteado");
    assert.equal(crearIdProducto("  Lápiz  Ñandú 2B! "), "lapiz-nandu-2b");
    assert.equal(crearIdProducto("!!!"), "");
  });
});
