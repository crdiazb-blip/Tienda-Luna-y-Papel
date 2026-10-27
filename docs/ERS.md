# Especificación de Requisitos de Software (ERS)

**Proyecto:** Luna y Papel, frontend de una papelería
**Asignatura:** DSY1104 Desarrollo Fullstack II, Evaluación Parcial N.º 2
**Versión:** 2.0 (actualiza la versión 1.0 de septiembre de 2026)
**Fecha:** octubre de 2026
**Integrantes del equipo:** _(completar con los nombres reales; este documento no los inventa)_

## 0. Origen de este documento

- La versión 1.0 existía como `ERS_Luna_y_Papel.md` (septiembre de 2026), describía el sitio HTML/CSS/JS. Esta versión 2.0 la toma como base.
- Se revisó cada requisito de la 1.0 contra el sitio real (`prototipo-html/`) y contra la aplicación React. Las diferencias detectadas se listan en la sección 9.
- La pauta de la evaluación pide entregar el ERS "añadiendo la propuesta personalizada, última versión". La propuesta personalizada de Luna y Papel está en la sección 8.

## 1. Propósito y alcance

Este documento define lo que hace la aplicación web de Luna y Papel después de migrarla a React y Bootstrap, y cómo se comprueba.

**Dentro del alcance:** mostrar la tienda, mostrar un catálogo de cuatro productos y permitir completar un formulario de pedido con validaciones y cálculo del total.

**Fuera del alcance:** cobros, pasarelas de pago, envío de correos, guardado de pedidos, cuentas de usuario, administración de productos, carrito de compras, API o backend.

**Diferencia con el enunciado de la pauta.** La introducción de la pauta dice que se entregará una plantilla de tienda con un carrito de compras ya implementado. Luna y Papel **no tiene carrito**: tiene un formulario de pedido de un producto y una cantidad. Los criterios de evaluación de la pauta (React, propiedades y estados, Bootstrap, pruebas con Jasmine y Karma, proceso de testeo) no dependen del carrito, y no se agregó uno por suposición.

## 2. Descripción general

| Sección | Ruta | Propósito |
|---|---|---|
| Inicio | `/` | Presentación, tres categorías informativas, video de lettering y datos de envío/retiro |
| Productos | `/productos` | Catálogo de cuatro productos con botón «Pedir» |
| Pedido | `/pedido` | Formulario con validación, total en pesos chilenos y datos de retiro |

Usuario: **cliente** que explora la tienda y calcula un pedido. (La versión 1.0 mencionaba un "administrador (futuro)"; no existe en esta versión.)

## 3. Catálogo

El catálogo está en `src/data/productos.js` y lo usan Productos y Pedido.

| Id | Producto | Categoría | Descripción | Precio |
|---|---|---|---|---|
| `cuaderno-punteado` | Cuaderno Punteado | CUADERNOS | 80 hojas, tapa dura y elástico de cierre. | $6.990 |
| `set-destacadores` | Set de Destacadores | ESCRITURA | Seis colores suaves con punta biselada. | $4.500 |
| `planificador-semanal` | Planificador Semanal | ORGANIZACIÓN | 50 hojas desprendibles para organizar cada semana. | $5.990 |
| `estuche-tela` | Estuche de Tela | ACCESORIOS | Estuche liviano con cierre y dos compartimentos. | $7.500 |

## 4. Requisitos funcionales

Estado: **Implementado** significa que existe en el código y fue comprobado (prueba automática y/o revisión manual en el navegador, ver `docs/TESTING.md`).

| Id | Requisito | Implementado en | Estado |
|---|---|---|---|
| RF-01 | Navegación principal con enlaces a Inicio, Productos y Pedido, enlace de la página actual resaltado y marca que lleva al inicio | `components/Encabezado.jsx`, `Menu.jsx` | Implementado (prueba 4; menú móvil solo revisado a mano) |
| RF-02 | Inicio: presentación, botón «Ver productos», imagen, tres categorías informativas con enlace a Productos, video de lettering y aviso de envíos/retiro | `pages/Inicio.jsx` | Implementado (revisión manual; prueba parcial en la 4) |
| RF-03 | Productos: mostrar los cuatro productos con categoría, nombre, descripción y precio, mediante componentes y `map` | `ListaProductos.jsx`, `TarjetaProducto.jsx` | Implementado (pruebas 1 y 2) |
| RF-04 | Cada botón «Pedir» abre el formulario con ese producto ya elegido | `TarjetaProducto.jsx`, `pages/Pedido.jsx` | Implementado (prueba 3) |
| RF-05 | Formulario con campos controlados: nombre, correo, producto, cantidad (parte en 1) y comentario opcional | `FormularioPedido.jsx` | Implementado (prueba 5) |
| RF-06 | Validar nombre: obligatorio, mínimo 3 caracteres sin contar espacios de los extremos | `utils/validacionesPedido.js` | Implementado (prueba 6) |
| RF-07 | Validar correo: obligatorio, formato básico `algo@algo.algo` sin espacios | `utils/validacionesPedido.js` | Implementado (prueba 6) |
| RF-08 | Validar producto: obligatorio y perteneciente al catálogo | `utils/validacionesPedido.js` | Implementado (prueba 6; la rama "no está en el catálogo" no tiene prueba) |
| RF-09 | Validar cantidad: número entero entre 1 y 10 (rechaza decimales, negativos, vacío y letras) | `utils/validacionesPedido.js` | Implementado (prueba 7) |
| RF-10 | Mostrar los errores junto a cada campo solo después del primer intento de envío; actualizarlos o quitarlos al corregir los datos | `FormularioPedido.jsx` | Implementado (prueba 6; revisión manual) |
| RF-11 | Calcular el total = precio del catálogo (buscado por id) × cantidad, y mostrarlo en pesos chilenos (ej. $13.980) | `utils/calcularTotal.js` | Implementado (pruebas 8 y 9) |
| RF-12 | Con datos válidos, mostrar el total y un mensaje que aclare que es una demostración: no hay cobro, correo ni guardado | `FormularioPedido.jsx` | Implementado (prueba 9) |
| RF-13 | El botón «Limpiar» restablece nombre, correo, producto, comentario, errores y resultado; la cantidad vuelve a 1 | `FormularioPedido.jsx` | Implementado (prueba 10) |
| RF-14 | Mostrar datos de retiro (Avenida Irarrázaval 1800, Ñuñoa; lunes a sábado, 10:00 a 18:00) y la nota de proyecto académico | `pages/Pedido.jsx` | Implementado (revisión manual) |
| RF-15 | Los resultados y errores generales se anuncian con `aria-live="polite"` | `FormularioPedido.jsx` | Implementado (revisión del código; no probado con lector de pantalla) |

## 5. Requisitos no funcionales

| Id | Requisito | Estado |
|---|---|---|
| RNF-01 | **Responsividad con Bootstrap** en móvil, tablet y escritorio, sin desplazamiento horizontal | Revisado en el navegador a 360, 768 y 1440 px de ancho: ninguna ruta se desborda (ancho de contenido ≤ ancho de ventana) y las imágenes se cargan. No se probó en dispositivos físicos ni en otros navegadores. |
| RNF-02 | Etiquetas asociadas a cada campo; foco visible; mensajes de error comprensibles | Implementado (etiquetas con `htmlFor`, regla `:focus-visible`, `aria-invalid` y `aria-describedby`). |
| RNF-03 | Identidad visual: fondo claro, verde oliva, dorado, tipografía sencilla (Arial) e imágenes originales | Implementado en `src/styles/estilos.css`, cargado después de Bootstrap. |
| RNF-04 | Tamaño mínimo de elementos pulsables de 44 px | Definido en CSS para botones y enlaces del menú. No medido con una herramienta. |
| RNF-05 | Contraste de color adecuado (WCAG 2.1 AA) | **No verificado** con herramienta. Se usan los mismos colores del sitio original. |
| RNF-06 | Mantenibilidad: componentes pequeños, nombres y comentarios en español, catálogo y reglas de validación en archivos propios | Implementado. |
| RNF-07 | Datos personales: no se almacenan ni se envían; no hay cookies propias | Implementado (todo ocurre en la memoria de la página). El video de YouTube incrustado puede aplicar sus propias políticas. |
| RNF-08 | Rendimiento | Compilación de producción (`npm run build`): JS 270,74 kB (86,03 kB comprimido), CSS 232,53 kB (31,61 kB comprimido), más dos imágenes de ~84 kB y ~107 kB. Sin medición de tiempo de carga. |
| RNF-09 | Compatibilidad | Se ejecutó solo en Chrome (156 en las pruebas). La versión 1.0 mencionaba Firefox, Safari y Edge; no se probaron. |

## 6. Tecnologías y restricciones

- React 19, React Router 7, Bootstrap 5.3 (solo CSS, sin JavaScript de Bootstrap), Vite 8. JavaScript con archivos `.jsx`.
- Pruebas: Jasmine 7, Karma 6, Chrome sin ventana, webpack + Babel (solo para las pruebas), Testing Library. Cobertura: karma-coverage con babel-plugin-istanbul.
- Node.js 20 o superior.
- **Restricciones:** sin TypeScript, Redux, Context, hooks propios, backend, autenticación, pagos ni base de datos. Estado con `useState` únicamente. El catálogo es un arreglo local.
- **Pruebas sin mocks ni espías:** restricción decidida por el equipo, ver `docs/TESTING.md`.

## 7. Casos de uso

1. **Explorar la tienda:** el cliente abre Inicio, lee la presentación y pulsa «Ver productos».
2. **Pedir un producto:** en Productos pulsa «Pedir» de un artículo; el formulario abre con ese producto elegido. Completa nombre, correo y cantidad, pulsa «Calcular total» y ve el total con el aviso de demostración.
3. **Corregir errores:** si envía con datos inválidos ve el error junto a cada campo; al corregir un campo, su error desaparece.
4. **Limpiar:** pulsa «Limpiar» y el formulario vuelve a su estado inicial.

## 8. Propuesta personalizada de Luna y Papel

Cambios respecto del sitio HTML original, para cumplir la pauta de la evaluación sin cambiar la esencia de la tienda:

1. **Migración a React:** cada parte de la página se convirtió en un componente con propiedades (`TarjetaProducto`, `ListaProductos`, `Boton`, `Mensaje`, `FormularioPedido`) o con estado (`Encabezado` para el menú móvil; `FormularioPedido` para datos, intento de envío y resultado).
2. **Catálogo único** con identificadores. El precio se obtiene del catálogo por id, no de un valor guardado en el formulario (en el HTML original el precio estaba en el `value` de cada opción).
3. **Bootstrap** para la grilla, tarjetas, formulario y navegación responsiva, con el CSS propio encima para conservar los colores.
4. **«Pedir» lleva al formulario con el producto preseleccionado** (en el original solo abría la página).
5. **Validación más estricta que la original:** correo con formato `algo@algo.algo` (antes bastaba con contener "@" y "."), cantidad solo entera de 1 a 10 (antes aceptaba decimales) y producto debe existir en el catálogo.
6. **Mensaje de resultado honesto:** el original decía "Pedido recibido". Ahora indica que es un cálculo de demostración y que no hay cobro, correo ni guardado. El botón «Calcular y enviar» pasó a llamarse «Calcular total» porque no envía nada.
7. **Pruebas automáticas** con Jasmine y Karma y medición de cobertura.

Lo que **no** se agregó, aunque podría proponerse como trabajo futuro: carrito con varios productos, persistencia de pedidos, panel de administración.

## 9. Diferencias con el ERS versión 1.0

| Versión 1.0 decía | Realidad verificada |
|---|---|
| Paleta "azul/gris" y "fondo blanco/gris claro" | El sitio usa fondo crema (cornsilk), verde oliva y dorado |
| Planificador: "50 hojas desprendibles" | La descripción original es "50 hojas desprendibles para organizar cada semana." |
| Estuche: "2 compartimentos" | La descripción original es "Estuche liviano con cierre y dos compartimentos." |
| Mensaje de éxito: "Pedido recibido. Total: $…" | Reemplazado por un mensaje de demostración (ver 8.6) |
| Stack sin dependencias, XAMPP/Apache | Reemplazado por React, Bootstrap y Vite; se ejecuta con `npm run dev` |
| Tamaño total < 500 KB, carga < 3 s, WCAG 2.1 AA | Metas no medidas o no cumplidas tal como se formularon (ver RNF-05 y RNF-08) |
| Usuario administrador (futuro) | Fuera del alcance de esta versión |
| Autor "Equipo de Desarrollo Académico", estado "Completado", fecha de próxima revisión | Reemplazados por la información de este documento |
