// Punto de entrada de Karma: reúne todos los archivos de prueba y el código de la aplicación.
// import.meta.webpackContext es la función de webpack que "lista" los archivos de una carpeta.

// 1) Carga todas las pruebas (*.spec.js / *.spec.jsx) de esta carpeta.
const contextoPruebas = import.meta.webpackContext(".", { recursive: true, regExp: /\.spec\.jsx?$/ });
contextoPruebas.keys().forEach(contextoPruebas);

// 2) Carga (NO ejecuta funciones de) todos los archivos de src/, salvo main.jsx.
//    Sirve para que el informe de cobertura incluya también los archivos que
//    ninguna prueba utiliza, y así el porcentaje no se vea mejor de lo que es.
const contextoAplicacion = import.meta.webpackContext("../src", {
  recursive: true,
  regExp: /^(?!.*main\.jsx$).*\.jsx?$/,
});
contextoAplicacion.keys().forEach(contextoAplicacion);
