# Documento de testing y cobertura

Proyecto Luna y Papel, DSY1104 Evaluación Parcial N.º 2. Los resultados salen de ejecutar `npm run test:web` y abrir la URL que imprime (copia en [`evidencia/resultado-qunit.txt`](evidencia/resultado-qunit.txt)).

## 1. Qué pide la pauta y qué se hizo

| La pauta pide (IE2.2.1, IE2.3.1) | Lo que se hizo |
|---|---|
| Pruebas unitarias a componentes frontend **con Jasmine y Karma**; para el nivel máximo, 10 pruebas | 10 casos, pero con **QUnit** (sección 2) |
| Verificar lógica, comportamientos y manipulación del DOM | Funciones puras, componentes montados en el navegador, eventos de clic y escritura |
| Entorno bien configurado, análisis de resultados y cobertura | Secciones 2, 5 y 6 |
| **Uso de mocks** (IE2.3.1 e IE2.3.2) | **No implementado, por decisión del equipo** (sección 4) |
| Documento de cobertura de testing | Este documento |

Diferencias con la pauta por decisión del equipo: **QUnit en lugar de Jasmine y Karma**, **sin mocks** y **Tailwind CSS en lugar de Bootstrap** (esta última no afecta a las pruebas). No hay constancia de que el docente las autorice. La pauta no fija un porcentaje mínimo de cobertura.

## 2. Configuración del entorno

**Dónde se ejecutó:** Windows 11, Node.js v24.21.0, npm 11.19.0, navegador Chromium integrado de la herramienta de trabajo.

**Herramientas:** QUnit 3, esbuild 0.28, @testing-library/react 16, @babel/core 8 y babel-plugin-istanbul 8 (versiones exactas en `package-lock.json`).

**Cómo funciona `npm run test:web`** (archivo `tests/servidor.js`):

1. Levanta un servidor de Node en el puerto 3002 e **imprime la URL**: `Pruebas QUnit disponibles en: http://localhost:3002`.
2. Cuando el navegador abre esa URL, el servidor arma una página con QUnit y con **todas las pruebas** compiladas en un solo archivo por **esbuild**, que traduce el JSX.
3. **QUnit** ejecuta las pruebas en el navegador y muestra el resultado (verde/rojo) en la propia página. Recargar la página vuelve a compilar y ejecutar.
4. **Testing Library** (`render`, `screen`, `fireEvent`) monta los componentes reales y simula clics y escritura. Internamente usa `act` de React, que espera a que React termine de actualizar el DOM antes de que la prueba lo revise.
5. **Cobertura:** al compilar, `babel-plugin-istanbul` marca cada archivo de `src/components` y `src/utils`. Al terminar QUnit, `tests/cobertura.js` cuenta qué sentencias, ramas y funciones se ejecutaron y muestra la tabla bajo los resultados. Se incluyen también los archivos que ninguna prueba usa (el servidor los importa todos).

Se necesita solo Node y un navegador; **no** hace falta la API encendida.

## 3. Los diez casos

Cada prueba sigue **Preparar → Ejecutar → Comprobar**. Cada `QUnit.test(...)` es un caso con objetivo propio; los `assert` dentro de un caso son los pasos de esa comprobación.

| N.º | Archivo | Objetivo | Cubre |
|---|---|---|---|
| 1 | `tests/productos.spec.jsx` | La lista muestra los cuatro productos con sus precios | Propiedades, DOM |
| 2 | `tests/productos.spec.jsx` | Una tarjeta muestra los datos que recibe por propiedades (con un producto inventado) y arma el enlace «Pedir» con su id | Propiedades, DOM |
| 3 | `tests/encabezado.spec.jsx` | El botón del encabezado abre y cierra el menú (clase `block` del menú y `aria-expanded`) | Estado, evento de clic |
| 4 | `tests/encabezado.spec.jsx` | El menú marca como activo el enlace de la ruta que recibe por propiedad (`aria-current` y fondo dorado) | Propiedades, DOM |
| 5 | `tests/formularioPedido.spec.jsx` | Un campo controlado cambia su valor al escribir y no muestra errores antes de enviar | Estado, evento de escritura |
| 6 | `tests/formularioPedido.spec.jsx` | Un formulario inválido muestra errores, no muestra total, y el error de un campo desaparece al corregirlo | Estado, validación, DOM |
| 7 | `tests/validaciones.spec.js` | La cantidad acepta enteros de 1 a 10 y rechaza 0, 11, -1, 2.5, vacío y texto | Lógica |
| 8 | `tests/validaciones.spec.js` | El total es precio × cantidad (6990 × 2 = 13980; 7500 × 3 = 22500), devuelve `null` si el producto no existe y se formatea `$13.980` | Lógica |
| 9 | `tests/formularioPedido.spec.jsx` | Un formulario válido muestra el total correcto y el aviso de que no se cobra ni se guarda nada | Estado, evento de envío, DOM |
| 10 | `tests/formularioPedido.spec.jsx` | «Limpiar» restablece campos, cantidad (vuelve a 1), errores y resultado | Estado, evento de clic |

Los datos de las pruebas vienen de `api/productos.json`, el mismo archivo que sirve la API.

**Cambio respecto de la versión con React Router:** al pasar a Next.js, la navegación entre páginas la hace el enrutador de Next, que no se monta en estas pruebas. Por eso ya no hay pruebas «pulsar Pedir y ver el formulario» ni «clic en el menú y ver otra sección»; se reemplazaron por las pruebas 3 y 4. Esa navegación se comprobó a mano (sección 7).

## 4. Mocks, espías y API simulada

- **Mocks y espías: no implementados**, por decisión del equipo. En `tests/` no hay dobles de prueba, espías, reemplazos de `fetch`, ni temporizadores o fechas falsas. Se puede comprobar con:
  ```powershell
  Select-String -Path tests\* -Pattern "spy|mock|stub|fake|fetch|setTimeout"
  ```
  La búsqueda no devuelve ninguna línea.
- La pauta **sí evalúa el uso de mocks** (IE2.3.1 e IE2.3.2). Esta omisión **deja ese aspecto pendiente**.
- **La API "simulada" no es un mock de las pruebas.** Es un servidor local real (`api/servidor.js`) que entrega datos fijos a la tienda. Las pruebas **no la llaman**: reciben los productos como propiedades, leyendo el mismo `api/productos.json`.
- Qué sí se usa y no es un mock: listas de valores como entradas de funciones puras, componentes reales con eventos reales.

## 5. Resultados reales

Última ejecución (detalle en `evidencia/resultado-qunit.txt`):

```text
QUnit: 10 tests completed in 0.3 seconds.
10 passed, 0 skipped, 0 failed, and 0 todo.
```

Otros comandos ejecutados: `npm install` (0 vulnerabilidades reportadas), `npm run build` (compila; rutas `/` estática, `/pedido` y `/productos` dinámicas).

## 6. Cobertura

Cobertura de `src/components` y `src/utils` (tabla generada por la página de pruebas):

| Métrica | Cubierto | Total | % |
|---|---|---|---|
| Sentencias | 69 | 73 | 94,52 |
| Ramas | 61 | 65 | 93,85 |
| Funciones | 25 | 28 | 89,29 |

| Archivo | Sentencias % | Ramas % | Líneas de sentencias sin ejecutar |
|---|---|---|---|
| `components/Boton.jsx`, `ListaProductos.jsx`, `Mensaje.jsx`, `Menu.jsx`, `TarjetaProducto.jsx` | 100 | 100 | |
| `components/FormularioPedido.jsx` | 100 | 91,89 | ramas sin recorrer (ver 6.2) |
| `components/Encabezado.jsx` | 60 | 100 | 19, 34 |
| `components/PiePagina.jsx` | 0 | 100 | 2 |
| `utils/calcularTotal.js`, `utils/productos.js` | 100 | 100 | |
| `utils/validacionesPedido.js` | 95,83 | 93,75 | 23 |

### 6.1 Qué se comprobó

Tarjetas y lista de productos, menú (apertura y ruta activa), formulario completo (escritura, envío, validación, resultado y limpieza), las cuatro validaciones (la de cantidad en detalle), el cálculo y formateo del total.

### 6.2 Qué quedó pendiente

- **Pie de página** (`PiePagina.jsx`): ninguna prueba lo muestra; es solo texto.
- **Encabezado, líneas 19 y 34:** cerrar el menú al pulsar la marca o al elegir un enlace. Se probó abrir/cerrar con el botón, no estos dos cierres.
- **Mensaje de error de cantidad dentro del formulario** (`FormularioPedido.jsx`, línea 126): la regla se prueba como función (caso 7); ninguna prueba muestra ese error en pantalla. Se revisó a mano con 2.5.
- **Producto fuera del catálogo** (`validacionesPedido.js`, línea 23): sin prueba.
- **No cubierto por diseño:** la conexión con la API (`src/utils/api.js`), las páginas de `src/app/` (se ejecutan en el servidor de Next y no se montan en el navegador de pruebas) y `EncabezadoConRuta.jsx` (usa el enrutador de Next). Se revisaron a mano (sección 7).
- **Mocks:** ver sección 4. Sin pruebas de extremo a extremo ni de otros navegadores.

### 6.3 Exclusiones y límites

- No se mide `node_modules`, `tests/`, `prototipo-html/`, `api/`, CSS ni imágenes.
- No se agregaron ejecuciones artificiales para subir el porcentaje.
- La cobertura indica qué líneas se ejecutaron, no que estén bien verificadas. La tabla se calcula con una función propia de `tests/cobertura.js` (no con una herramienta de informes como karma-coverage), por lo que no hay informe HTML por archivo.

## 7. Revisión manual en el navegador

Con `npm run api` y `npm run dev` en marcha, en el navegador integrado (Chromium). No se probó en dispositivos físicos ni en Firefox, Safari o Edge.

| Comprobación | Resultado |
|---|---|
| API: `GET /productos`, `GET /productos/estuche-tela`, id inexistente | Devuelve los 4 productos, el producto pedido y un 404 |
| Páginas `/`, `/productos`, `/pedido?producto=estuche-tela` | Cargan; Productos muestra los datos de la API; Pedido trae Estuche de Tela elegido |
| Clic en «Pedir» del Set de Destacadores | Abre `/pedido?producto=set-destacadores` con ese producto elegido |
| Anchos 360, 768 y 1440 px en las tres rutas | Sin desplazamiento horizontal; las imágenes cargan |
| Formulario vacío al enviar | Errores de nombre y correo y aviso «Revisa los campos marcados.» (el producto venía elegido) |
| Cantidad 2.5 | Rechazada con «La cantidad debe ser un número entero entre 1 y 10.» |
| Pedido válido (3 × Estuche de Tela) | Total $22.500 y aviso de demostración |
| «Limpiar» | Campos vacíos, cantidad 1, sin errores ni resultado |
| `npm run build` | Compila sin errores |

El formulario se manejó con eventos simulados desde la consola del navegador, no con teclado físico. No se comprobó: el menú móvil a mano en esta versión (lo cubre la prueba 3), el video en reproducción, lectores de pantalla ni contraste con herramientas.
