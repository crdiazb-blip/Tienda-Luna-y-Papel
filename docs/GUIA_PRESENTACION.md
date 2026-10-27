# Guía para la presentación

La pauta evalúa la presentación de forma **individual** (60 % de la evaluación): cada integrante debe poder explicar el diseño con React, el manejo de propiedades y estados, Bootstrap, las pruebas con Jasmine y Karma y el proceso de testeo. Esta guía ayuda a preparar la exposición; no describe resultados de una presentación que aún no ocurre.

Preparación antes de exponer: abrir una terminal en la carpeta con `package.json`, ejecutar `npm install` una vez, y tener listo `npm run dev` (http://localhost:5173) y `npm test`. Chrome debe estar instalado.

## 1. Cómo explicar la estructura React (IE2.1.3)

Idea central: **la página se arma con piezas (componentes) que se pueden reutilizar**.

1. `index.html` solo tiene un `<div id="root">`. `src/main.jsx` le dice a React que dibuje ahí la aplicación y carga primero Bootstrap y luego nuestro CSS.
2. `src/App.jsx` arma la página: `Encabezado`, la sección según la dirección (`Routes`) y `PiePagina`. Las tres secciones son `pages/Inicio.jsx`, `pages/Productos.jsx` y `pages/Pedido.jsx`.
3. Las piezas pequeñas están en `src/components/`. Las páginas las usan; por ejemplo `Productos.jsx` usa `ListaProductos`, que usa `TarjetaProducto`.
4. Los datos y la lógica no están dentro de los componentes: el catálogo está en `src/data/productos.js` y las reglas en `src/utils/`.
5. Por qué React y no el HTML original: antes había tres páginas con el menú y el pie repetidos, y un script que buscaba elementos por id. Ahora el menú se escribe una vez y los datos del formulario viven en el estado, no en el DOM.

Decisiones de implementación (no vienen de la pauta): Vite, JSX, React Router y Testing Library. La pauta pide un framework como React, Bootstrap, Jasmine y Karma.

## 2. Ejemplo de propiedades (props) y de estado (IE2.1.4)

**Propiedades: datos que un componente recibe de su padre.** Ver `src/components/ListaProductos.jsx` y `TarjetaProducto.jsx`:

- `Productos.jsx` le pasa el arreglo: `<ListaProductos productos={productos} />`.
- `ListaProductos` recorre el arreglo con `map` y por cada producto escribe `<TarjetaProducto id=... nombre=... categoria=... descripcion=... precio=... />`.
- `TarjetaProducto` no tiene datos propios: muestra lo que recibe. Por eso la misma tarjeta sirve para los cuatro productos (y para uno inventado en la prueba 2).
- Otro ejemplo: `Boton` recibe `tipo`, `variante`, `onClick` y el texto (`children`).

**Estado: datos que cambian mientras se usa la página.** Ver `src/components/FormularioPedido.jsx`, tres `useState`:

- `datos`: lo escrito en los campos. Cada campo es **controlado**: su `value` sale del estado y `onChange={cambiarCampo}` lo actualiza.
- `intentoEnvio`: si ya se pulsó «Calcular total». Los errores solo se muestran después.
- `resultado`: el total calculado, o `null`.
- Los **errores no son estado**: se calculan en cada dibujo con `validarPedido(datos)`. Por eso, al corregir un campo, su error desaparece solo.
- Otro estado: `menuAbierto` en `Encabezado.jsx`, que abre y cierra el menú en móvil.

Puntos que suelen preguntar: *¿por qué `key` en el `map`?* (para que React distinga cada elemento); *¿qué hace `preventDefault`?* (evita que el navegador recargue la página al enviar el formulario).

## 3. Cómo funciona el formulario y el total

Flujo de `FormularioPedido.jsx`:

1. El usuario escribe: `cambiarCampo` guarda el valor en `datos` y borra el resultado anterior.
2. Pulsa «Calcular total»: `enviar` llama `setIntentoEnvio(true)` y `validarPedido(datos)` (`src/utils/validacionesPedido.js`).
3. Si hay errores, cada campo muestra el suyo (`Mensaje`) con la clase `is-invalid` de Bootstrap, y aparece «Revisa los campos marcados.».
4. Si no hay errores, `calcularTotal(id, cantidad)` (`src/utils/calcularTotal.js`) busca el producto **por id en el catálogo** y multiplica su precio por la cantidad. El precio no viaja en el formulario, así que no se puede alterar desde ahí.
5. `formatearPesos` entrega el texto en pesos chilenos ($13.980) y se muestra el mensaje de demostración: no hay cobro, correo ni guardado.
6. «Limpiar» vuelve `datos` al valor inicial (cantidad 1), `intentoEnvio` a `false` y `resultado` a `null`.

Reglas: nombre mínimo 3 caracteres; correo con formato `algo@algo.algo`; producto del catálogo; cantidad entera de 1 a 10 (`/^\d+$/` rechaza decimales, negativos y letras).

Honestidad sobre el alcance: es un formulario de **un** producto, no un carrito de compras; la pauta menciona un carrito en su introducción, pero este proyecto no lo tiene.

## 4. Dónde se aplica Bootstrap

Se instala con `npm install bootstrap` y se importa en `src/main.jsx`: `import "bootstrap/dist/css/bootstrap.min.css"`, antes de `estilos.css` para que nuestros colores tengan prioridad.

| Uso | Dónde |
|---|---|
| Contenedor `container-lg` | `App.jsx`, `Encabezado.jsx` |
| Filas y columnas (`row`, `col-md-6`, `col-lg-8`/`col-lg-4`) | `Inicio.jsx`, `Productos.jsx`, `Pedido.jsx` (formulario a la izquierda, información a la derecha en escritorio; apilados en móvil) |
| Cuadrícula de tarjetas (`row-cols-1 row-cols-md-2`, `row-cols-md-3`) y `card` | `ListaProductos.jsx`, `TarjetaProducto.jsx`, `Inicio.jsx` |
| Barra de navegación que se colapsa (`navbar`, `navbar-expand-md`, `navbar-toggler`) | `Encabezado.jsx` |
| Formulario (`form-label`, `form-control`, `form-select`, `is-valid`, `is-invalid`) y alertas (`alert`) | `FormularioPedido.jsx`, `Mensaje.jsx` |
| Botones (`btn`) | `Boton.jsx`, `TarjetaProducto.jsx` |
| Imágenes adaptables (`img-fluid`) y video proporcional (`ratio ratio-16x9`) | `Inicio.jsx`, `Productos.jsx` |

El CSS propio (`src/styles/estilos.css`) solo ajusta colores (verde oliva, dorado, durazno, fondo crema), foco visible y tamaños mínimos de botones.

Para mostrar la responsividad: en el navegador, abrir las herramientas de desarrollo (F12) y el modo de dispositivos; revisar 360 px, 768 px y 1440 px. En `docs/TESTING.md`, sección 8, quedan registrados los tamaños que ya se revisaron.

## 5. Cómo demostrar las pruebas (IE2.2.2)

1. Mostrar `karma.conf.cjs` y explicar en una frase cada pieza (ver `docs/TESTING.md`, sección 2).
2. Ejecutar `npm test`. Se verá la lista de las **10 pruebas** con su nombre y «Executed 10 of 10 SUCCESS», seguida de la tabla de cobertura. Ejecutarlo en vivo: no basta con mostrar capturas.
3. Abrir un archivo de prueba, por ejemplo `tests/formularioPedido.spec.jsx` y explicar el patrón **Preparar → Ejecutar → Comprobar** con la prueba 9 (formulario válido) o la 10 (Limpiar).
4. Mostrar una prueba de lógica pura, `tests/validaciones.spec.js`: «6990 × 2 = 13980».
5. Mostrar una prueba de evento sobre componentes reales: la 3 (pulsar «Pedir» abre el formulario con el producto elegido).
6. Para demostrar que las pruebas detectan fallos: cambiar temporalmente `precio: 6990` por otro valor en `src/data/productos.js`, ejecutar `npm test` y mostrar las pruebas que fallan; después **deshacer el cambio**.
7. Abrir `coverage/html/index.html` (o la copia en `docs/evidencia/cobertura-html/index.html`) y mostrar qué líneas quedan sin cubrir.

## 6. Cómo explicar el entorno, los resultados y la omisión de mocks (IE2.3.2)

**Entorno y proceso.** Jasmine escribe las pruebas, Karma las ejecuta en Chrome sin ventana, webpack y Babel traducen el JSX, istanbul mide la cobertura. Proceso: se escribe el caso, se ejecuta, se corrige, se revisa la cobertura y se anotan los pendientes.

**Resultados** (los de la última ejecución registrada en `docs/TESTING.md`; volver a ejecutar antes de exponer y usar lo que aparezca): 10 de 10 pruebas pasan; cobertura de sentencias 96,34 %, ramas 90,62 %, funciones 93,93 %, líneas 96,29 %. Pendientes: menú móvil, mensaje de error de cantidad dentro del formulario, rama de id inválido en la dirección y rama de producto fuera del catálogo. La cobertura no mide CSS, imágenes ni `main.jsx`, y no prueba que cada línea esté bien verificada.

**Sobre los mocks, decir con claridad:**

> «Un mock es un reemplazo ficticio de una dependencia para aislar lo que se prueba. La pauta incluye el uso de mocks entre los conceptos del testeo. Nuestro equipo decidió no usar mocks ni espías: el proyecto no tiene API ni backend, y probamos los componentes y funciones reales con eventos reales. Esa omisión fue decisión del equipo, no una autorización del docente, y deja ese aspecto pendiente respecto de la pauta.»

Qué sí hicimos y no es un mock: pasar listas de valores a funciones puras, montar componentes reales y simular clics y escritura, y usar el `MemoryRouter` de React Router (el mismo enrutador, con la dirección en memoria).

No afirmar: que el docente aprobó omitirlos; que la cobertura implica que todo está probado; que la aplicación es un carrito de compras; que el pedido se guarda, se cobra o se envía por correo.

## 7. Archivos que debe mostrar cada integrante

La pauta permite equipos de hasta 3 estudiantes y evalúa a cada uno individualmente. Esta es una **propuesta de reparto**; asignar los nombres reales. Todos deben poder explicar el flujo completo.

**Integrante 1: estructura y propiedades (React)**
- `index.html`, `src/main.jsx`, `src/App.jsx`
- `src/pages/Inicio.jsx`, `src/pages/Productos.jsx`
- `src/components/ListaProductos.jsx`, `src/components/TarjetaProducto.jsx`, `src/components/Boton.jsx`, `src/components/Mensaje.jsx`
- `src/data/productos.js`

**Integrante 2: estado, formulario y Bootstrap**
- `src/components/FormularioPedido.jsx`, `src/pages/Pedido.jsx`
- `src/components/Encabezado.jsx`, `src/components/Menu.jsx`
- `src/utils/validacionesPedido.js`, `src/utils/calcularTotal.js`
- `src/styles/estilos.css` y las clases de Bootstrap (sección 4)

**Integrante 3: pruebas y documentación**
- `karma.conf.cjs`, `tests/index.js`
- `tests/productos.spec.jsx`, `tests/navegacion.spec.jsx`, `tests/formularioPedido.spec.jsx`, `tests/validaciones.spec.js`
- `docs/TESTING.md`, `docs/evidencia/` (salida y cobertura), `docs/ERS.md`

Referencia para comparar con el original: `prototipo-html/` (el sitio HTML/CSS/JS anterior).
