const path = require("path");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],

    files: ["tests/index.js"],
    preprocessors: {
      "tests/index.js": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: false,
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
                plugins: [["istanbul", { include: ["src/**"], exclude: ["tests/**"] }]],
              },
            },
          },
        ],
      },
    },

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
