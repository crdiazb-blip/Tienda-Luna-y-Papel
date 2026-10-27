# Luna y Papel

Papelería ficticia de Ñuñoa, Santiago. Es un proyecto académico de DSY1104 (Desarrollo Fullstack II), Evaluación Parcial N.º 2: la tienda HTML/CSS/JavaScript original se migró a **React** con **Bootstrap** y se le agregaron **pruebas unitarias con Jasmine y Karma**.

Tiene tres secciones: **Inicio** (presentación, categorías informativas, video de lettering y datos de la tienda), **Productos** (catálogo de cuatro artículos) y **Pedido** (formulario con validación y cálculo del total).

> El formulario es una **demostración académica**: no cobra, no envía correos y no guarda pedidos. No es un carrito de compras: se calcula el total de **un** producto por pedido.

## Tecnologías usadas

| Tecnología | Para qué |
|---|---|
| React 19 (JavaScript, archivos `.jsx`) | Componentes, propiedades y estados |
| React Router 7 | Navegación entre `/`, `/productos` y `/pedido` |
| Bootstrap 5.3 (CSS) | Diseño responsivo: contenedores, filas/columnas, tarjetas, formulario, botones |
| Vite 8 | Servidor de desarrollo y compilación |
| Jasmine 7 + Karma 6 | Pruebas unitarias, ejecutadas en Chrome sin ventana |
| karma-coverage + babel-plugin-istanbul | Informe de cobertura |
| @testing-library/react | Montar componentes reales y simular clics/escritura en las pruebas |

Vite, JSX y React Router son **decisiones de implementación** del equipo; la pauta de la evaluación pide un framework JS como React, Bootstrap, y Jasmine/Karma, pero no exige esos nombres.

## Requisitos

- **Node.js 20 o superior** (verificado con Node v24.21.0 y npm 11.19.0).
- **Google Chrome instalado** (Karma lo abre sin ventana para ejecutar las pruebas).

## Comandos

Todos los comandos se ejecutan **dentro de la carpeta que contiene `package.json`** (la raíz de este proyecto).

```bash
npm install        # instala dependencias (usa package-lock.json)
npm run dev        # desarrollo: abre http://localhost:5173
npm test           # ejecuta las 10 pruebas una vez y genera la cobertura en coverage/
npm run test:watch # pruebas en modo continuo (vuelve a correr al guardar)
npm run build      # compila para producción en dist/
npm run preview    # sirve lo compilado
```

El informe de cobertura queda en `coverage/html/index.html` (carpeta que no se sube a Git). Una copia de la última ejecución está en `docs/evidencia/`.

## Organización de archivos

```
package.json, package-lock.json   dependencias y comandos
vite.config.js                    configuración de Vite
karma.conf.cjs                    configuración de Karma/Jasmine/cobertura
index.html                        página única donde React dibuja la app
public/imagenes/                  cuaderno.jpg y escritorio.jpg (imágenes originales)
src/
  main.jsx                        conecta React con index.html; importa Bootstrap y estilos
  App.jsx                         encabezado + rutas + pie de página
  pages/                          Inicio.jsx, Productos.jsx, Pedido.jsx
  components/                     Encabezado, Menu, PiePagina, ListaProductos,
                                  TarjetaProducto, FormularioPedido, Boton, Mensaje
  data/productos.js               catálogo único de 4 productos (usado por Productos y Pedido)
  utils/                          validacionesPedido.js, calcularTotal.js
  styles/estilos.css              identidad visual (se carga después de Bootstrap)
tests/                            index.js y los archivos *.spec.js(x) con las 10 pruebas
docs/                             ERS.md, TESTING.md, GUIA_PRESENTACION.md, evidencia/
prototipo-html/                   sitio original HTML/CSS/JS, conservado solo como referencia
```

## Límites de la demostración

- No hay backend, base de datos, cuentas de usuario, pagos ni carrito. El catálogo es un arreglo en `src/data/productos.js`.
- El pedido no se envía ni se guarda: solo se valida y se calcula el total.
- Las pruebas **no usan mocks ni espías** (decisión del equipo). La pauta evalúa su uso, por lo que ese punto queda **pendiente**; ver `docs/TESTING.md`.
- La cobertura mide solo el código de `src/`; no mide CSS, imágenes ni el video de YouTube.

## Documentos

- [`docs/ERS.md`](docs/ERS.md): especificación de requisitos de software.
- [`docs/TESTING.md`](docs/TESTING.md): configuración, casos, resultados y cobertura de las pruebas.
- [`docs/GUIA_PRESENTACION.md`](docs/GUIA_PRESENTACION.md): guía para explicar y demostrar el proyecto.
