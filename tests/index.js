const contextoPruebas = import.meta.webpackContext(".", { recursive: true, regExp: /\.spec\.jsx?$/ });
contextoPruebas.keys().forEach(contextoPruebas);

const contextoAplicacion = import.meta.webpackContext("../src", {
  recursive: true,
  regExp: /^(?!.*main\.jsx$).*\.jsx?$/,
});
contextoAplicacion.keys().forEach(contextoAplicacion);
