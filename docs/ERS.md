# Especificación de Requisitos de Software (ERS)

**Proyecto:** Luna y Papel, frontend de una papelería
**Asignatura:** DSY1104 Desarrollo Fullstack II, Evaluación Parcial N.º 2
**Versión:** 3.2 (agrega el panel `/admin` con inicio de sesión a la 3.0; la 1.0 describía el sitio HTML/CSS/JS)
**Fecha:** octubre de 2026
**Integrantes del equipo:** _(completar con los nombres reales; este documento no los inventa)_

## 0. Origen de este documento

- La versión 1.0 existía como `ERS_Luna_y_Papel.md` (septiembre de 2026) y describía el sitio HTML/CSS/JS. Esta versión la toma como base y la contrasta con el proyecto real.
- La versión 2.0 describía una aplicación React con Vite y pruebas Jasmine/Karma. Esta versión refleja el cambio decidido por el equipo a **Next.js, QUnit y una API local simulada**. El uso de Next.js fue autorizado por el docente, según informa el equipo (no hay una constancia escrita en este repositorio). QUnit, Tailwind CSS y la omisión de mocks son decisiones del equipo sin constancia de autorización.
- La pauta pide entregar el ERS "añadiendo la propuesta personalizada, última versión". La propuesta está en la sección 8.

## 1. Propósito y alcance

Define lo que hace la aplicación web de Luna y Papel y cómo se comprueba.

**Dentro del alcance:** mostrar la tienda, mostrar un catálogo de cuatro productos entregado por una API local simulada y permitir completar un formulario de pedido con validaciones y cálculo del total. También hay un panel de administrador de solo lectura, protegido con un inicio de sesión provisorio.

**Fuera del alcance:** cobros, pasarelas de pago, envío de correos, guardado de pedidos, registro de usuarios y cuentas múltiples, creación, edición o borrado de productos, carrito de compras, base de datos.

**Diferencia con la pauta.** Su introducción habla de una plantilla con carrito de compras. Luna y Papel **no tiene carrito**: tiene un formulario de un producto y una cantidad, y no se agregó uno por suposición. La pauta nombra Jasmine y Karma y Bootstrap; este proyecto usa **QUnit** y **Tailwind CSS** (decisiones del equipo).

## 2. Descripción general

| Sección | Ruta | Propósito |
|---|---|---|
| Inicio | `/` | Presentación, tres categorías informativas, video de lettering y datos de envío/retiro |
| Productos | `/productos` | Catálogo de cuatro productos (desde la API) con botón «Pedir» |
| Pedido | `/pedido` | Formulario con validación, total en pesos chilenos y datos de retiro |
| Admin | `/admin` | Panel de solo lectura: resumen del catálogo y tabla de productos (desde la API). Pide inicio de sesión |
| Inicio de sesión | `/admin/login` | Formulario de usuario y contraseña del administrador |

El enlace al panel está en el **pie de página** («Administración»), no en el menú principal.

Usuarios: **cliente**, que explora la tienda y calcula un pedido, y **administrador**, que inicia sesión para consultar el panel. Existe una sola cuenta provisoria (usuario `admin`, contraseña `1234`).

**API simulada** (`npm run api`, `http://localhost:3001`):

| Petición | Respuesta |
|---|---|
| `GET /productos` | Arreglo con los 4 productos |
| `GET /productos/<id>` | Un producto, o 404 si no existe |

Los datos están en `api/productos.json`. La API no guarda nada ni recibe pedidos.

## 3. Catálogo

| Id | Producto | Categoría | Descripción | Precio |
|---|---|---|---|---|
| `cuaderno-punteado` | Cuaderno Punteado | CUADERNOS | 80 hojas, tapa dura y elástico de cierre. | $6.990 |
| `set-destacadores` | Set de Destacadores | ESCRITURA | Seis colores suaves con punta biselada. | $4.500 |
| `planificador-semanal` | Planificador Semanal | ORGANIZACIÓN | 50 hojas desprendibles para organizar cada semana. | $5.990 |
| `estuche-tela` | Estuche de Tela | ACCESORIOS | Estuche liviano con cierre y dos compartimentos. | $7.500 |

## 4. Requisitos funcionales

**Implementado** significa que existe en el código y se comprobó (prueba automática y/o revisión manual; ver `docs/TESTING.md`).

| Id | Requisito | Implementado en | Estado |
|---|---|---|---|
| RF-01 | Navegación con enlaces a Inicio, Productos y Pedido, enlace de la página actual resaltado y marca que lleva al inicio; menú que se abre y cierra en móvil | `components/Encabezado.jsx`, `EncabezadoConRuta.jsx`, `Menu.jsx` | Implementado (pruebas 3 y 4) |
| RF-02 | Inicio: presentación, botón «Ver productos», imagen, tres categorías informativas con enlace a Productos, video de lettering y aviso de envíos/retiro | `app/page.jsx` | Implementado (revisión manual) |
| RF-03 | Productos: mostrar los cuatro productos con categoría, nombre, descripción y precio, mediante componentes y `map` | `app/productos/page.jsx`, `ListaProductos.jsx`, `TarjetaProducto.jsx` | Implementado (pruebas 1 y 2) |
| RF-04 | Cada botón «Pedir» abre el formulario con ese producto ya elegido | `TarjetaProducto.jsx`, `app/pedido/page.jsx` | Implementado (prueba 2 el enlace; clic revisado a mano) |
| RF-05 | Catálogo obtenido de la API local; si no responde, se muestra un aviso | `utils/api.js`, `api/servidor.js` | Implementado (revisión manual; sin prueba automática) |
| RF-06 | Formulario con campos controlados: nombre, correo, producto, cantidad (parte en 1) y comentario opcional | `FormularioPedido.jsx` | Implementado (prueba 5) |
| RF-07 | Validar nombre: obligatorio, mínimo 3 caracteres sin contar espacios de los extremos | `utils/validacionesPedido.js` | Implementado (prueba 6) |
| RF-08 | Validar correo: obligatorio, formato básico `algo@algo.algo` sin espacios | `utils/validacionesPedido.js` | Implementado (prueba 6) |
| RF-09 | Validar producto: obligatorio y perteneciente al catálogo | `utils/validacionesPedido.js` | Implementado (prueba 6; la rama "no está en el catálogo" no tiene prueba) |
| RF-10 | Validar cantidad: entero entre 1 y 10 (rechaza decimales, negativos, vacío y letras) | `utils/validacionesPedido.js` | Implementado (prueba 7) |
| RF-11 | Mostrar los errores junto a cada campo solo después del primer intento de envío; actualizarlos o quitarlos al corregir | `FormularioPedido.jsx` | Implementado (prueba 6) |
| RF-12 | Calcular el total = precio del catálogo (buscado por id) × cantidad, en pesos chilenos (ej. $13.980) | `utils/calcularTotal.js` | Implementado (pruebas 8 y 9) |
| RF-13 | Con datos válidos, mostrar el total y un mensaje de demostración: no hay cobro, correo ni guardado | `FormularioPedido.jsx` | Implementado (prueba 9) |
| RF-14 | «Limpiar» restablece nombre, correo, producto, comentario, errores y resultado; la cantidad vuelve a 1 | `FormularioPedido.jsx` | Implementado (prueba 10) |
| RF-15 | Mostrar datos de retiro (Avenida Irarrázaval 1800, Ñuñoa; lunes a sábado, 10:00 a 18:00) | `app/pedido/page.jsx` | Implementado (revisión manual) |
| RF-16 | Panel de administrador (`/admin`): muestra el número de productos, el precio promedio, el producto más caro y el más barato, los productos por categoría y una tabla del catálogo; si la API no responde, muestra un aviso | `app/admin/page.jsx`, `utils/resumenProductos.js` | Implementado (prueba 11 para el cálculo del resumen; la página se revisó a mano) |
| RF-17 | El panel exige iniciar sesión: sin sesión válida, `/admin` redirige a `/admin/login`. Solo entra usuario `admin` con contraseña `1234` (provisorias). Error genérico si los datos no coinciden. Botón «Cerrar sesión». El enlace de entrada está en el pie de página | `app/admin/login/page.jsx`, `app/admin/acciones.js`, `utils/credenciales.js`, `utils/sesion.js` | Implementado (prueba 12 para la regla de usuario y clave; el flujo completo se revisó a mano) |
| RF-18 | Resultados y errores generales se anuncian con `aria-live="polite"` | `FormularioPedido.jsx` | Implementado (revisión del código; no probado con lector de pantalla) |

## 5. Requisitos no funcionales

| Id | Requisito | Estado |
|---|---|---|
| RNF-01 | **Responsividad con Tailwind CSS** en móvil, tablet y escritorio, sin desplazamiento horizontal | Revisado en el navegador a 360, 768 y 1440 px: ninguna ruta se desborda y las imágenes cargan. No probado en dispositivos físicos ni otros navegadores. |
| RNF-02 | Etiquetas asociadas a cada campo; foco visible; mensajes de error comprensibles | Implementado (`htmlFor`, `:focus-visible`, `aria-invalid`, `aria-describedby`). |
| RNF-03 | Identidad visual: fondo claro, verde oliva, dorado, tipografía Arial e imágenes originales | Implementado en `app/estilos.css`, con Tailwind CSS. |
| RNF-04 | Elementos pulsables de al menos 44 px | Definido en CSS para botones y enlaces del menú; no medido con herramienta. |
| RNF-05 | Contraste de color WCAG 2.1 AA | **No verificado** con herramienta. Se usan los colores del sitio original. |
| RNF-06 | Mantenibilidad: componentes pequeños, nombres en español, sin comentarios en el código, datos en un solo archivo (`api/productos.json`) | Implementado. |
| RNF-07 | Datos personales: no se almacenan ni se envían | Implementado. El video de YouTube incrustado puede aplicar sus propias políticas. |
| RNF-08 | Disponibilidad de datos: si la API está apagada, la tienda sigue funcionando y avisa | Implementado (Productos y Pedido muestran el aviso). |
| RNF-09 | Seguridad básica del panel: la validación ocurre en el servidor (no en el navegador); la sesión es una cookie `httpOnly` firmada que no se puede falsificar sin el secreto del servidor | Implementado y comprobado a mano (sin sesión y con cookie falsa, `/admin` responde 307 a `/admin/login` sin enviar datos). **Límites:** credenciales provisorias escritas en el código, una sola cuenta, sin límite de intentos, sin HTTPS, y el secreto de firma por defecto es de desarrollo (se cambia con la variable `SECRETO_SESION`). No es adecuado para producción. |
| RNF-10 | Compatibilidad | Probado solo en Chromium. La versión 1.0 mencionaba Firefox, Safari y Edge; no se probaron. |

## 6. Tecnologías y restricciones

- **Next.js 16** (App Router) con **React 19** y archivos `.jsx`; **Tailwind CSS 4** (clases de utilidad).
- **API local** en Node sin librerías (`api/servidor.js`), puerto 3001.
- **QUnit 3** para las pruebas, servidas por `npm run test:web` (puerto 3002) y vistas en el navegador. Apoyo: esbuild, Testing Library, babel-plugin-istanbul.
- Node.js 20 o superior.
- **Restricciones:** sin TypeScript, Redux, Context, hooks propios ni base de datos. Estado con `useState`. La autenticación es mínima: una cuenta provisoria validada en el servidor de Next.js (sin librerías de autenticación).
- **Pruebas sin mocks ni espías:** decisión del equipo (ver `docs/TESTING.md`).
- Comandos: `npm install`, `npm run api`, `npm run dev`, `npm run test:web`, `npm run build`.

## 7. Casos de uso

1. **Explorar la tienda:** el cliente abre Inicio y pulsa «Ver productos».
2. **Pedir un producto:** en Productos pulsa «Pedir»; el formulario abre con ese producto elegido. Completa nombre, correo y cantidad, pulsa «Calcular total» y ve el total con el aviso de demostración.
3. **Corregir errores:** con datos inválidos ve el error junto a cada campo; al corregir un campo, su error desaparece.
4. **Limpiar:** pulsa «Limpiar» y el formulario vuelve al estado inicial.
5. **Consultar el panel:** el administrador pulsa «Administración» en el pie de página, escribe usuario y contraseña, ve el resumen del catálogo y cierra sesión con el botón correspondiente.

## 8. Propuesta personalizada de Luna y Papel

Cambios respecto del sitio HTML original:

1. **Next.js con React:** cada parte de la página es un componente con propiedades (`TarjetaProducto`, `ListaProductos`, `Boton`, `Mensaje`, `FormularioPedido`) o con estado (`Encabezado`, `FormularioPedido`). Las tres páginas son rutas de Next.
2. **API local simulada** que entrega el catálogo, con identificadores. El precio se obtiene del catálogo por id, no de un valor guardado en el formulario (en el HTML original el precio estaba en el `value` de cada opción).
3. **Tailwind CSS** para grilla, tarjetas, formulario y navegación responsiva, con los colores originales definidos como tema.
4. **«Pedir» lleva al formulario con el producto preseleccionado.**
5. **Validación más estricta que la original:** correo `algo@algo.algo` (antes bastaba con "@" y "."), cantidad solo entera de 1 a 10 (antes aceptaba decimales) y producto existente en el catálogo.
6. **Mensaje de resultado honesto:** el original decía "Pedido recibido"; ahora le dice al cliente que por ahora solo se calcula el total y que no se cobra, no se envía correo y el pedido no queda guardado. El botón «Calcular y enviar» pasó a «Calcular total» porque no envía nada.
7. **Pruebas automáticas con QUnit** que se ven en una página web, con tabla de cobertura.
8. **Panel de administrador de solo lectura** en `/admin`, con un resumen del catálogo y su tabla.
9. **Inicio de sesión del panel**, validado en el servidor, con el enlace de entrada en el pie de página.

No se agregó (trabajo futuro posible): carrito con varios productos, persistencia de pedidos, varias cuentas o contraseñas cifradas en una base de datos, y crear, editar o borrar productos desde el panel.

## 9. Diferencias con el ERS versión 1.0

| Versión 1.0 decía | Realidad verificada |
|---|---|
| Paleta "azul/gris" y "fondo blanco/gris claro" | Fondo crema (cornsilk), verde oliva y dorado |
| Planificador: "50 hojas desprendibles" | Descripción original: "50 hojas desprendibles para organizar cada semana." |
| Estuche: "2 compartimentos" | Descripción original: "Estuche liviano con cierre y dos compartimentos." |
| Mensaje de éxito "Pedido recibido. Total: $…" | Reemplazado por un aviso que aclara que solo se calcula el total |
| Sitio estático, sin dependencias, XAMPP/Apache | Next.js, Tailwind CSS y API local; se ejecuta con `npm run dev` y `npm run api` |
| Sin base de datos ni API | Hay una API local simulada (sin base de datos) |
| Tamaño < 500 KB, carga < 3 s, WCAG 2.1 AA | Metas no medidas o no verificadas (ver RNF-05) |
| Usuario administrador (futuro), "agregar o modificar productos y gestionar pedidos" | Existe un panel de solo lectura con inicio de sesión provisorio; no se agregan, modifican ni gestionan datos |
