# Documento de testing y cobertura

Proyecto Luna y Papel, DSY1104 Evaluación Parcial N.º 2. Todos los resultados de este documento provienen de ejecutar `npm test` en esta carpeta (salida completa en [`evidencia/salida-karma.txt`](evidencia/salida-karma.txt)).

## 1. Qué pide la pauta y qué se hizo

| La pauta pide (IE2.2.1, IE2.3.1) | Lo que se hizo |
|---|---|
| Pruebas unitarias a componentes frontend con Jasmine y Karma; para el nivel máximo, 10 pruebas | 10 casos con Jasmine y Karma (sección 4) |
| Verificar lógica, comportamientos y manipulación del DOM | Funciones puras, componentes montados en Chrome, eventos reales de clic y escritura |
| Entorno de pruebas bien configurado, análisis de resultados y cobertura | Secciones 2, 6 y 7 |
| **Uso de mocks** (aparece en los indicadores IE2.3.1 e IE2.3.2) | **No implementado, por decisión del equipo** (sección 5) |
| Documento de cobertura de testing que valide el alcance de lo cubierto | Este documento |

La pauta no fija un porcentaje mínimo de cobertura.

## 2. Configuración del entorno

**Equipo donde se ejecutó:** Windows 11, Node.js v24.21.0, npm 11.19.0, Chrome Headless 156.0.0.0.

**Versiones instaladas** (de `package-lock.json`): Karma 6.4.4, Jasmine (jasmine-core) 7.0.2, karma-jasmine 5.1.0, karma-chrome-launcher 3.2.0, karma-webpack 5.0.1, webpack 5.112.2, babel-loader 10.1.1, @babel/core 8.0.9, karma-coverage 2.2.1, karma-spec-reporter 0.0.37, @testing-library/react 16.3.3, react 19.3.1.

**Cómo funciona cada pieza** (archivo `karma.conf.cjs`):

1. **Jasmine** aporta `describe`, `it` y `expect`: cómo se escriben y se comprueban las pruebas.
2. **Karma** levanta un servidor local, abre **Chrome sin ventana** (`ChromeHeadless`) y ejecuta ahí las pruebas, de modo que se usa un DOM real, no uno simulado.
3. **webpack + Babel** convierten el JSX y el código moderno antes de enviarlos a Chrome. Se necesitan porque Karma no entiende JSX por sí solo. Como el proyecto usa `"type": "module"`, se desactivó la exigencia de extensiones en los `import` (`fullySpecified: false`) para que las pruebas lean el código igual que Vite.
4. **babel-plugin-istanbul** "marca" cada archivo de `src/` para poder contar qué líneas se ejecutaron. Solo se marca `src/`; no se marcan las pruebas ni `node_modules`.
5. **karma-coverage** arma el informe (HTML, texto, JSON y lcov) en `coverage/`.
6. **Testing Library** (`render`, `screen`, `fireEvent`) monta los componentes reales y simula clics y escritura. Internamente envuelve cada acción en `act` de React, que espera a que React termine de actualizar el DOM antes de que la prueba lo revise; por eso no se escribe `act` a mano.
7. `tests/index.js` es la entrada única: carga todos los `*.spec.js(x)` y además **importa** todos los archivos de `src/` (menos `main.jsx`). Importar un archivo no ejecuta sus funciones; solo hace que aparezca en la cobertura aunque ninguna prueba lo use.

**Comandos:** `npm test` (una ejecución con cobertura) y `npm run test:watch` (continuo). Se ejecutan en la carpeta con `package.json`. Se necesita Chrome instalado.

## 3. Estructura de cada prueba

Todas siguen los pasos **Preparar → Ejecutar → Comprobar** (el código no tiene comentarios; el orden se reconoce por la estructura de cada caso):

1. *Preparar*: datos de entrada o montar el componente.
2. *Ejecutar*: llamar la función o simular el clic/escritura.
3. *Comprobar*: `expect(...)` sobre el resultado o sobre lo visible en el DOM.

Cada `it(...)` es un caso con un objetivo propio; los `expect` dentro de un caso son los pasos de esa comprobación, no pruebas separadas.

## 4. Los diez casos

| N.º | Archivo | Objetivo | Cubre |
|---|---|---|---|
| 1 | `tests/productos.spec.jsx` | La lista muestra los cuatro productos del catálogo con sus precios | Propiedades (`ListaProductos`), DOM |
| 2 | `tests/productos.spec.jsx` | Una tarjeta usa las propiedades recibidas (se prueba con un producto que no está en el catálogo para demostrar que solo usa sus props) y arma el enlace «Pedir» con su id | Propiedades (`TarjetaProducto`), DOM |
| 3 | `tests/productos.spec.jsx` | Pulsar «Pedir» en Productos abre el formulario con ese producto elegido | Evento de clic, navegación, propiedades iniciales |
| 4 | `tests/navegacion.spec.jsx` | El menú lleva a la sección elegida y marca el enlace activo (`aria-current`) | Evento de clic, rutas, DOM |
| 5 | `tests/formularioPedido.spec.jsx` | Un campo controlado cambia su valor al escribir y no muestra errores antes de enviar | Estado, evento de escritura |
| 6 | `tests/formularioPedido.spec.jsx` | Un formulario inválido muestra errores junto a los campos, no muestra total, y el error de un campo desaparece al corregirlo | Estado, validación, DOM |
| 7 | `tests/validaciones.spec.js` | La cantidad acepta enteros de 1 a 10 y rechaza 0, 11, -1, 2.5, vacío y texto | Lógica (función pura `validarCantidad`) |
| 8 | `tests/validaciones.spec.js` | El total es precio × cantidad (6990 × 2 = 13980; 7500 × 3 = 22500), devuelve `null` si el producto no existe, y se formatea como `$13.980` | Lógica (`calcularTotal`, `formatearPesos`) |
| 9 | `tests/formularioPedido.spec.jsx` | Un formulario válido muestra el total correcto y el mensaje de demostración | Estado, evento de envío, DOM |
| 10 | `tests/formularioPedido.spec.jsx` | «Limpiar» restablece campos, cantidad (vuelve a 1), errores y resultado, tanto después de un resultado como después de errores | Estado, evento de clic |

**Alcance de las pruebas 3 y 4:** montan `App` completo dentro de `MemoryRouter`, el enrutador de la propia librería React Router con la dirección guardada en memoria (así no cambia la URL de la página de pruebas). En producción se usa `BrowserRouter`; la prueba no cubre esa diferencia.

## 5. Mocks y espías: no implementados

- **Decisión:** el equipo decidió implementar y probar el proyecto **sin mocks, espías ni reemplazos ficticios de dependencias**. En el código de `tests/` no hay `spyOn`, `jasmine.createSpy`, `createSpyObj`, `jasmine.clock`, reemplazos de `fetch` ni módulos simulados. Se comprueba con el buscador de texto del editor o con:
  ```powershell
  Select-String -Path tests\* -Pattern "spyOn|createSpy|jasmine.clock|mock|stub|fake|fetch"
  ```
  No devuelve ningún resultado.
- **Qué NO se considera mock** y sí se usó: entregar listas y textos como entradas a funciones puras; montar componentes reales y enviarles eventos de clic y escritura; el `MemoryRouter` real.
- **Relación con la pauta:** la pauta **sí evalúa el uso de mocks** (indicadores IE2.3.1 e IE2.3.2: "uso de mocks"). Esta decisión del equipo **no fue autorizada por el docente** (no hay constancia de ello) y **deja ese aspecto pendiente**: el proyecto no puede declararse completo en el nivel máximo de esos indicadores. Si el docente exige mocks, habría que agregarlos antes de la entrega.
- **Límite técnico:** el proyecto no usa API ni backend (el catálogo es un arreglo local), por lo que no se encontró ninguna dependencia externa que impidiera probar sin reemplazos.

## 6. Comandos ejecutados y resultados reales

```text
> npm install        -> 0 vulnerabilidades reportadas
> npm run build      -> 38 módulos transformados; dist/ generado (JS 270,74 kB, CSS 232,53 kB)
> npm test           -> Executed 10 of 10 SUCCESS ; TOTAL: 10 SUCCESS ; código de salida 0
```

Extracto de la salida de `npm test` (Jasmine ejecuta en orden aleatorio, por eso los números no aparecen en orden):

```text
Productos (propiedades y eventos)
  √ 3. pulsar «Pedir» en Productos abre el formulario con ese producto elegido
  √ 1. la lista muestra los cuatro productos del catálogo con sus precios
  √ 2. una tarjeta muestra los datos que recibe por propiedades
Navegación
  √ 4. el menú lleva a la sección elegida y marca el enlace activo
Lógica del pedido
  √ 8. el total es precio del catálogo × cantidad y se formatea en pesos chilenos
  √ 7. la cantidad acepta enteros de 1 a 10 y rechaza fuera de rango, decimales y no numéricos
Formulario de pedido (estado, validación y resultado)
  √ 9. un formulario válido muestra el total correcto y el mensaje de demostración
  √ 5. un campo controlado cambia su valor al escribir y no muestra errores antes de enviar
  √ 10. «Limpiar» restablece campos, cantidad, errores y resultado
  √ 6. un formulario inválido muestra errores, no muestra total y el error se quita al corregir
Chrome Headless 156.0.0.0 (Windows 10): Executed 10 of 10 SUCCESS
```

La salida completa, con el informe de cobertura, está en `evidencia/salida-karma.txt`.

En la salida aparecen avisos `404: /imagenes/...jpg`: Karma no sirve la carpeta `public/`, así que las imágenes no se cargan dentro de las pruebas. No afecta a ninguna comprobación; las imágenes se verificaron en el navegador (sección 8).

## 7. Cobertura

Cobertura del código de `src/` (herramienta: karma-coverage con istanbul). Informe navegable: [`evidencia/cobertura-html/index.html`](evidencia/cobertura-html/index.html); resumen en [`evidencia/cobertura-resumen.json`](evidencia/cobertura-resumen.json).

| Métrica | Cubierto | Total | % |
|---|---|---|---|
| Sentencias | 79 | 82 | 96,34 |
| Ramas | 58 | 64 | 90,62 |
| Funciones | 31 | 33 | 93,93 |
| Líneas | 78 | 81 | 96,29 |

| Archivo | Sentencias % | Ramas % | Líneas no cubiertas |
|---|---|---|---|
| `src/App.jsx` | 100 | 100 | |
| `components/Boton.jsx`, `Mensaje.jsx`, `Menu.jsx`, `PiePagina.jsx`, `ListaProductos.jsx`, `TarjetaProducto.jsx` | 100 | 100 | |
| `components/FormularioPedido.jsx` | 100 | 92,1 | ramas en líneas 128-131 (ver 7.2) |
| `components/Encabezado.jsx` | 60 | 50 | 11-20 |
| `data/productos.js` | 100 | 100 | |
| `pages/Inicio.jsx`, `Productos.jsx` | 100 | 100 | |
| `pages/Pedido.jsx` | 100 | 50 | rama de la línea 8 |
| `utils/calcularTotal.js` | 100 | 100 | |
| `utils/validacionesPedido.js` | 95,83 | 93,75 | línea 23 |

### 7.1 Qué código se ejecutó y qué comportamientos se comprobaron

Las pruebas ejecutan el catálogo, las tarjetas y su lista, el formulario completo (escritura, envío, validación, resultado y limpieza), el cálculo y formateo del total, las cuatro validaciones, la navegación del menú y la preselección desde «Pedir». Lo comprobado está en la tabla de la sección 4.

### 7.2 Qué quedó pendiente (no cubierto por pruebas automáticas)

- **Menú móvil** (`Encabezado.jsx`, líneas 11-20): el botón que abre y cierra el menú en pantallas pequeñas y su cierre al elegir un enlace. Se revisó **a mano** en el navegador a 360 px; no hay prueba automática.
- **Mensaje de error de cantidad en pantalla** (`FormularioPedido.jsx`, 128-131): la regla de cantidad se prueba como función (caso 7), pero ninguna prueba muestra ese error dentro del formulario. Se revisó a mano escribiendo 2.5.
- **`?producto=` inválido** (`Pedido.jsx`, línea 8): si la dirección trae un id que no existe, el producto queda sin elegir. Sin prueba.
- **Producto fuera del catálogo** (`validacionesPedido.js`, línea 23): el mensaje "El producto elegido no está en el catálogo." no tiene prueba. La interfaz solo ofrece productos del catálogo, por lo que esta rama protege contra datos manipulados.
- **Mocks**: ver sección 5.
- Sin pruebas de extremo a extremo, de accesibilidad automática ni de otros navegadores.

### 7.3 Exclusiones y límites de la medición

- **`src/main.jsx`** no se mide: solo conecta React con `index.html`, y en las pruebas no existe ese `div#root`. Es un archivo corto (14 líneas).
- **No se mide** `node_modules`, la carpeta `tests/`, `prototipo-html/`, los archivos de configuración, el CSS, las imágenes ni el video de YouTube.
- Los archivos no usados por ninguna prueba **sí** se incluyen (por el paso 7 de la sección 2). Hoy todos los archivos de `src/` (salvo `main.jsx`) están ejecutados por alguna prueba.
- No se agregaron ejecuciones artificiales de funciones para subir el porcentaje.
- **Límites:** la cobertura indica qué líneas se ejecutaron, no que estén bien probadas: una línea puede ejecutarse sin que un `expect` verifique su resultado. El porcentaje es una guía; las comprobaciones reales son las de la sección 4. Jasmine corre las pruebas en orden aleatorio.

## 8. Revisión manual en el navegador

Servidor de desarrollo (`npm run dev`) revisado en el navegador integrado de la herramienta de trabajo (Chromium). No se probó en dispositivos físicos ni en Firefox/Safari/Edge.

| Comprobación | Resultado |
|---|---|
| Anchos probados: 360 px (móvil), 768 px (tablet), 1440 px (escritorio) | En las tres rutas (`/`, `/productos`, `/pedido`), el ancho del contenido no supera el ancho de la ventana (sin desplazamiento horizontal) |
| Imágenes `escritorio.jpg` y `cuaderno.jpg` | Cargan (ancho natural 1200 px) y se adaptan al ancho disponible |
| Consola del navegador | Sin errores en Inicio |
| Menú a 360 px | El botón de tres líneas abre el menú; al elegir un enlace se cierra |
| Enlaces «Pedir» | Cada uno apunta a `/pedido?producto=<id>`; el de Estuche de Tela abrió el formulario con ese producto elegido |
| Formulario vacío al enviar | Errores de nombre, correo y producto, y el aviso «Revisa los campos marcados.» |
| Corrección en vivo | Al escribir un correo válido, su error desapareció |
| Cantidad 2.5 | Rechazada con «La cantidad debe ser un número entero entre 1 y 10.» |
| Pedido válido (3 × Estuche de Tela) | Total $22.500 y aviso de demostración |
| «Limpiar» | Campos vacíos, cantidad 1, sin errores ni resultado |
| Escritorio (1440 px) | Formulario a la izquierda e información de compra al lado |

No se comprobó: el video de YouTube en reproducción (solo que el `iframe` apunta a la dirección original), lectores de pantalla ni contraste con herramientas.
