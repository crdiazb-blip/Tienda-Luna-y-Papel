# Luna y Papel

Papelería ficticia de Ñuñoa, Santiago. Proyecto académico de DSY1104 (Desarrollo Fullstack II), Evaluación Parcial N.º 2. La tienda HTML/CSS/JavaScript original se migró a **Next.js (React)** con **Bootstrap**, una **API local simulada** para los productos y **pruebas con QUnit** que se ven en el navegador.

Tiene tres secciones: **Inicio** (presentación, categorías informativas, video de lettering y datos de la tienda), **Productos** (catálogo de cuatro artículos) y **Pedido** (formulario con validación y cálculo del total).

> El formulario es una **demostración académica**: no cobra, no envía correos y no guarda pedidos. No es un carrito de compras: calcula el total de **un** producto por pedido.

## Tecnologías

| Tecnología | Para qué |
|---|---|
| Next.js 16 + React 19 (`.jsx`) | Páginas, rutas (`/`, `/productos`, `/pedido`), componentes, propiedades y estados |
| Bootstrap 5.3 (solo CSS) | Diseño responsivo |
| API local (`api/servidor.js`, Node) | Entrega los productos en `http://localhost:3001/productos` |
| QUnit 3 | Pruebas unitarias, ejecutadas en una página web |
| esbuild + Testing Library + istanbul | Preparar las pruebas, montar componentes y medir cobertura |

## Requisitos

- **Node.js 20 o superior** (verificado con Node v24.21.0 y npm 11.19.0).
- Un navegador (para ver las pruebas).

## Comandos

Todos se ejecutan **dentro de la carpeta que contiene `package.json`**.

```bash
npm install        # instala las dependencias (Next.js, React, Bootstrap, QUnit...)
npm run api        # terminal 1: API de productos en http://localhost:3001/productos
npm run dev        # terminal 2: la tienda en http://localhost:3000
npm run test:web   # pruebas QUnit: imprime la URL (http://localhost:3002) para abrir en el navegador
npm run build      # compila la tienda para producción
npm start          # sirve lo compilado (después de npm run build)
```

La tienda necesita la API encendida para mostrar los productos. Si la API está apagada, Productos y Pedido muestran un aviso que lo indica. `npm run test:web` no necesita la API.

## Organización de archivos

```
package.json, package-lock.json   dependencias y comandos
next.config.mjs                   configuración mínima de Next.js
api/
  servidor.js                     API simulada (Node, sin librerías): GET /productos y GET /productos/<id>
  productos.json                  los 4 productos (única fuente de datos)
public/imagenes/                  cuaderno.jpg y escritorio.jpg (imágenes originales)
src/
  app/                            rutas de Next.js
    layout.jsx                    estructura común: Bootstrap, encabezado y pie
    page.jsx                      Inicio (/)
    productos/page.jsx            Productos (/productos), pide los datos a la API
    pedido/page.jsx               Pedido (/pedido), pide los datos a la API
    estilos.css                   identidad visual (se carga después de Bootstrap)
  components/                     Encabezado, EncabezadoConRuta, Menu, PiePagina, ListaProductos,
                                  TarjetaProducto, FormularioPedido, Boton, Mensaje
  utils/                          validacionesPedido.js, calcularTotal.js, productos.js, api.js
tests/                            servidor.js (npm run test:web), cobertura.js y los *.spec.js(x)
docs/                             ERS.md, TESTING.md, GUIA_PRESENTACION.md, evidencia/
prototipo-html/                   sitio original HTML/CSS/JS, solo como referencia
```

## Límites de la demostración

- La API es **simulada**: un servidor local con datos fijos en `api/productos.json`. No hay base de datos, cuentas, pagos ni carrito.
- El pedido no se envía ni se guarda: solo se valida y se calcula el total.
- Las pruebas **no usan mocks ni espías** (decisión del equipo) y usan **QUnit en lugar de Jasmine y Karma**, que son los que nombra la pauta. Ver `docs/TESTING.md`.
- La cobertura mide `src/components` y `src/utils` (salvo `api.js` y `EncabezadoConRuta.jsx`); no mide `src/app`, CSS ni imágenes.

## Documentos

- [`docs/ERS.md`](docs/ERS.md): especificación de requisitos de software.
- [`docs/TESTING.md`](docs/TESTING.md): configuración, casos, resultados y cobertura de las pruebas.
- [`docs/GUIA_PRESENTACION.md`](docs/GUIA_PRESENTACION.md): guía para explicar y demostrar el proyecto.
