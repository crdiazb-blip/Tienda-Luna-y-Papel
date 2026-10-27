// Configuración de Karma + Jasmine para las pruebas de Luna y Papel.
//  - Karma abre un Chrome sin ventana (ChromeHeadless) y ejecuta ahí las pruebas.
//  - Jasmine aporta describe / it / expect.
//  - webpack + Babel convierten el JSX (y el código moderno) a algo que Chrome entiende.
//  - babel-plugin-istanbul "marca" los archivos de src/ para poder medir la cobertura real.
//  - karma-coverage genera el informe de cobertura en la carpeta coverage/.
const path = require("path");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],

    // Un único archivo de entrada: tests/index.js reúne todas las pruebas y el código de src/.
    files: ["tests/index.js"],
    preprocessors: {
      "tests/index.js": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: false,
      // Permite escribir imports sin extensión (import App from "./App"), como hace Vite.
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          { test: /\.jsx?$/, resolve: { fullySpecified: false } },
          {
            test: /\.jsx?$/,
            include: [path.resolve(__dirname, "src"), path.resolve(__dirname, "tests")],
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "100" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // Solo se mide el código de la aplicación (src/), no las pruebas ni node_modules.
                // (src/main.jsx no se carga en las pruebas: ver exclusiones en docs/TESTING.md)
                plugins: [["istanbul", { include: ["src/**"], exclude: ["tests/**"] }]],
              },
            },
          },
        ],
      },
    },

    // "spec" muestra el nombre de cada prueba; "coverage" genera el informe de cobertura.
    reporters: ["spec", "coverage"],

    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text" },
        { type: "text-summary" },
        { type: "json-summary", subdir: ".", file: "resumen.json" },
        { type: "lcovonly", subdir: ".", file: "lcov.info" },
      ],
    },

    browsers: ["ChromeHeadless"],
    singleRun: false,
    restartOnFileChange: true,
  });
};
