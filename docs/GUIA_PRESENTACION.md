# Guía para la presentación

La pauta evalúa la presentación de forma **individual** (60 % de la evaluación): cada integrante debe explicar el diseño con el framework, el manejo de propiedades y estados, el diseño responsivo, las pruebas y el proceso de testeo. Esta guía ayuda a preparar la exposición; no describe resultados de una presentación que aún no ocurre.

Antes de exponer, en la carpeta con `package.json`: `npm install` una vez. Luego dos terminales: `npm run api` y `npm run dev` (tienda en http://localhost:3000). Para las pruebas: `npm run test:web` y abrir la URL que imprime (http://localhost:3002).

## 1. Cómo explicar la estructura (IE2.1.3)

Idea central: **la página se arma con piezas (componentes) reutilizables**, y Next.js entrega cada página según su carpeta.

1. `src/app/layout.jsx` es la estructura común: carga Tailwind CSS y los colores de la tienda, y pone el encabezado y el pie en todas las páginas.
2. Cada carpeta de `src/app/` es una ruta: `page.jsx` es Inicio (`/`), `productos/page.jsx` es `/productos` y `pedido/page.jsx` es `/pedido`, `admin/page.jsx` es el panel `/admin` (protegido con login) y `admin/login/page.jsx` es el formulario de entrada.
3. Las piezas pequeñas están en `src/components/`. Por ejemplo, la página Productos usa `ListaProductos`, que usa `TarjetaProducto`.
4. Los datos vienen de la **API local** (`api/servidor.js`). Las páginas Productos y Pedido la consultan con `obtenerProductos()` (`src/utils/api.js`) antes de dibujarse. Si la API está apagada, muestran un aviso.
5. Las reglas están fuera de los componentes, en `src/utils/` (validaciones y total).
6. Los componentes con estado o eventos llevan `"use client"` en la primera línea (`Encabezado`, `EncabezadoConRuta`, `FormularioPedido`): significa que se ejecutan en el navegador. Las páginas sin estado se dibujan en el servidor.

Decisiones del equipo (no vienen de la pauta, que pide un framework JS como React, Bootstrap, y Jasmine y Karma): Next.js, API local, QUnit y Tailwind CSS en lugar de Bootstrap. **Next.js** lo autorizó el docente, según informa el equipo: se puede decir en la presentación, idealmente con el mensaje o correo donde lo autorizó a mano. QUnit, Tailwind CSS y la omisión de mocks no tienen autorización conocida y no deben presentarse como autorizados.

## 2. Ejemplo de propiedades y de estado (IE2.1.4)

**Propiedades (props): datos que un componente recibe de su padre.** `src/components/ListaProductos.jsx` y `TarjetaProducto.jsx`:

- La página le pasa el arreglo: `<ListaProductos productos={productos} />`.
- `ListaProductos` recorre el arreglo con `map` y por cada producto escribe un `<TarjetaProducto id nombre categoria descripcion precio />`.
- `TarjetaProducto` no tiene datos propios: muestra lo que recibe. Por eso sirve para los cuatro productos (y para uno inventado en la prueba 2).
- `Menu` recibe `rutaActual` y marca el enlace activo; `Boton` recibe `tipo`, `variante`, `onClick` y su texto.

**Estado: datos que cambian mientras se usa la página.** `src/components/FormularioPedido.jsx`, tres `useState`:

- `datos`: lo escrito. Cada campo es **controlado**: su `value` sale del estado y `onChange={cambiarCampo}` lo actualiza.
- `intentoEnvio`: si ya se pulsó «Calcular total»; los errores solo se muestran después.
- `total`: el total calculado o `null`.
- Los **errores no son estado**: se calculan en cada dibujo con `validarPedido(datos, productos)`; por eso, al corregir un campo, su error desaparece solo.
- Otro estado: `menuAbierto` en `Encabezado.jsx`.

Preguntas frecuentes: *¿para qué `key` en `map`?* (para que React distinga los elementos); *¿qué hace `preventDefault`?* (evita que el navegador recargue la página al enviar el formulario); *¿por qué `"use client"`?* (porque usa `useState` y eventos, que solo existen en el navegador).

## 3. Cómo funcionan el formulario y el total

1. El usuario escribe: `cambiarCampo` guarda el valor en `datos` y borra el resultado anterior.
2. Pulsa «Calcular total»: `enviar` marca `intentoEnvio` y llama `validarPedido` (`src/utils/validacionesPedido.js`).
3. Con errores, cada campo muestra el suyo (`Mensaje`) con borde rojo (clase `campo-invalido`), y aparece «Revisa los campos marcados.».
4. Sin errores, `calcularTotal(productos, id, cantidad)` (`src/utils/calcularTotal.js`) busca el producto **por id en el catálogo que llegó de la API** y multiplica su precio por la cantidad. El precio no viaja en el formulario.
5. `formatearPesos` da el texto en pesos chilenos ($13.980) y se muestra el mensaje de demostración: no hay cobro, correo ni guardado.
6. «Limpiar» deja `datos` en su valor inicial (cantidad 1), `intentoEnvio` en `false` y `total` en `null`.

Reglas: nombre mínimo 3 caracteres; correo `algo@algo.algo`; producto del catálogo; cantidad entera de 1 a 10.

Alcance: es un formulario de **un** producto, no un carrito.

### Cómo se valida el inicio de sesión del administrador

El enlace «Administración» está en el pie de página y lleva a `/admin`. La validación ocurre **en el servidor de Next.js**, no en el navegador, porque una comprobación hecha en el navegador se puede saltar.

1. **Guardia del panel.** `src/app/admin/page.jsx` se ejecuta en el servidor y lo primero que hace es leer la cookie `sesion_admin` y preguntar a `tokenValido(...)` si es válida. Si no lo es, hace `redirect("/admin/login")`: no se pide nada a la API ni se dibuja el panel.
2. **Formulario.** `/admin/login` (`src/app/admin/login/page.jsx`) muestra usuario y contraseña. Al enviarlo, Next ejecuta la acción del servidor `iniciarSesion` (`src/app/admin/acciones.js`).
3. **Comparación.** `iniciarSesion` llama a `validarCredenciales(usuario, clave)` (`src/utils/credenciales.js`), que compara con `===` el usuario `admin` y la contraseña `1234` (distingue mayúsculas).
4. **Si no coinciden:** redirige a `/admin/login?error=1` y la página muestra «Usuario o contraseña incorrectos.», sin decir cuál de los dos falló.
5. **Si coinciden:** `crearToken()` (`src/utils/sesion.js`) calcula un HMAC-SHA256 del usuario con un secreto que solo conoce el servidor, y lo guarda en la cookie `sesion_admin` con `httpOnly` (el JavaScript del navegador no puede leerla), `sameSite: "lax"` y duración de 8 horas. Después redirige a `/admin`.
6. **En cada visita al panel** `tokenValido` recalcula ese token y lo compara con el de la cookie (con `timingSafeEqual`). Quien no conoce el secreto no puede fabricar un token válido: una cookie inventada se rechaza (se probó con el valor «falsificada»).
7. **Cerrar sesión:** `cerrarSesion` borra la cookie y vuelve al login.

Límites que hay que decir en voz alta: las credenciales (`admin` / `1234`) son provisorias y están escritas en el código; hay una sola cuenta; no hay límite de intentos ni HTTPS; el secreto de firma por defecto es de desarrollo (se cambia con la variable `SECRETO_SESION`); y la API de productos del puerto 3001 sigue siendo pública, porque entrega los mismos datos del catálogo público. De todo el flujo, la prueba automática 12 cubre solo la regla de usuario y clave; el resto se comprobó a mano.

## 4. Dónde se aplica Tailwind CSS (responsividad)

Se activa con `@import "tailwindcss";` en `src/app/estilos.css` (y `postcss.config.mjs`). Los colores de la tienda están en el bloque `@theme` de ese archivo y se usan como `bg-oliva`, `bg-dorado`, etc. Las clases con prefijo `md:` o `lg:` cambian el diseño en pantallas más anchas (por ejemplo `grid-cols-1 md:grid-cols-2`: una columna en móvil, dos desde tablet).

| Uso | Dónde |
|---|---|
| Contenedor centrado (`mx-auto max-w-[1100px]`) | `app/layout.jsx`, `Encabezado.jsx` |
| Cuadrículas (`grid`, `md:grid-cols-2`, `lg:grid-cols-3`, `lg:col-span-2`) | `app/page.jsx`, `app/productos/page.jsx`, `app/pedido/page.jsx`, `ListaProductos.jsx` |
| Tarjetas de producto y categoría (`flex flex-col`, `border`, `p-5`) | `TarjetaProducto.jsx`, `app/page.jsx` |
| Menú que se colapsa (`hidden md:block` y `block`; el botón usa `md:hidden`) | `Encabezado.jsx`, `Menu.jsx` |
| Formulario (`.etiqueta`, `.campo`, `.campo-invalido`, `.campo-valido`) y avisos (`Mensaje`) | `FormularioPedido.jsx`, `Mensaje.jsx`, `app/estilos.css` |
| Botones (`.boton`, `.boton-gris`) | `Boton.jsx`, `TarjetaProducto.jsx`, `app/page.jsx`, `app/estilos.css` |
| Imágenes (`w-full object-cover`) y video proporcional (`aspect-video w-full`) | `app/page.jsx`, `app/productos/page.jsx` |

`estilos.css` define los colores del tema, los estilos base (títulos, foco visible) y las pocas clases repetidas (botones y campos). Para mostrar la responsividad: F12 y modo de dispositivos a 360, 768 y 1440 px. Los tamaños ya revisados están en `docs/TESTING.md`, sección 7.

## 5. Cómo demostrar las pruebas (IE2.2.2)

1. Ejecutar `npm run test:web`: imprime la URL. Abrirla en el navegador.
2. La página muestra los **12 tests en verde** de QUnit y, debajo, la **tabla de cobertura**. Ejecutarlo en vivo, no solo mostrar capturas.
3. Explicar el entorno: `tests/servidor.js` junta las pruebas con esbuild y las sirve; QUnit las ejecuta en el navegador; Testing Library monta los componentes reales.
4. Abrir `tests/formularioPedido.spec.jsx` y explicar **Preparar → Ejecutar → Comprobar** con la prueba 9 (formulario válido) o la 10 (Limpiar).
5. Mostrar una prueba de lógica, `tests/validaciones.spec.js`: «6990 × 2 = 13980».
6. Mostrar una prueba de evento: la 3 (el botón abre y cierra el menú).
7. Para demostrar que detectan fallos: cambiar temporalmente un precio en `api/productos.json` (por ejemplo el del cuaderno), recargar la página de pruebas y ver qué falla; luego **deshacer el cambio**.

## 6. Cómo explicar el entorno, los resultados y la omisión de mocks (IE2.3.2)

**Proceso:** se escribe el caso, se recarga la página de pruebas, se corrige, se revisa la cobertura y se anotan los pendientes.

**Resultados** (los registrados en `docs/TESTING.md`; vuelve a ejecutar antes de exponer y usa lo que veas): 12 de 12 pruebas pasan; cobertura de sentencias 95,56 %, ramas 94,67 %, funciones 91,43 %. Pendientes: pie de página, dos cierres del menú, mensaje de error de cantidad dentro del formulario, producto fuera del catálogo y el flujo completo del inicio de sesión (solo se prueba la regla de usuario y clave). La cobertura no mide `src/app`, la API, la sesión, CSS ni imágenes, y no garantiza que cada línea esté bien verificada.

**Sobre QUnit y la pauta, decir con claridad:** la pauta nombra Jasmine y Karma. El equipo decidió usar QUnit; esa diferencia no consta como autorizada por el docente.

**Sobre los mocks, decir con claridad:**

> «Un mock es un reemplazo ficticio de una dependencia para aislar lo que se prueba. La pauta incluye el uso de mocks entre los conceptos del testeo. Nuestro equipo decidió no usar mocks ni espías: probamos los componentes y funciones reales con eventos reales, y las pruebas reciben los productos como datos, sin llamar a la API. Esa omisión fue decisión del equipo, no una autorización del docente, y deja ese aspecto pendiente respecto de la pauta.»

La API simulada **no es un mock de las pruebas**: es un servidor local real que entrega datos fijos a la tienda.

No afirmar: que el docente aprobó QUnit o la omisión de mocks; que la cobertura implica que todo está probado; que la app es un carrito; que el pedido se guarda, se cobra o se envía por correo.

## 7. Archivos que debe mostrar cada integrante

La pauta permite equipos de hasta 3 y evalúa a cada uno individualmente. Esta es una **propuesta de reparto**; asignar los nombres reales. Todos deben poder explicar el flujo completo.

**Integrante 1: estructura, rutas y propiedades**
- `src/app/layout.jsx`, `src/app/page.jsx`, `src/app/productos/page.jsx`
- `src/components/ListaProductos.jsx`, `TarjetaProducto.jsx`, `Boton.jsx`, `Mensaje.jsx`
- `api/servidor.js`, `api/productos.json`, `src/utils/api.js`
- `src/app/admin/page.jsx`, `src/utils/resumenProductos.js`

**Integrante 2: estado, formulario, inicio de sesión y Tailwind**
- `src/app/admin/login/page.jsx`, `src/app/admin/acciones.js`, `src/utils/credenciales.js`, `src/utils/sesion.js`
- `src/components/FormularioPedido.jsx`, `src/app/pedido/page.jsx`
- `src/components/Encabezado.jsx`, `EncabezadoConRuta.jsx`, `Menu.jsx`
- `src/utils/validacionesPedido.js`, `calcularTotal.js`, `productos.js`
- `src/app/estilos.css` y las clases de Tailwind (sección 4)

**Integrante 3: pruebas y documentación**
- `tests/servidor.js`, `tests/cobertura.js`
- `tests/productos.spec.jsx`, `encabezado.spec.jsx`, `formularioPedido.spec.jsx`, `validaciones.spec.js`
- `docs/TESTING.md`, `docs/evidencia/`, `docs/ERS.md`

Referencia para comparar con el original: `prototipo-html/`.
