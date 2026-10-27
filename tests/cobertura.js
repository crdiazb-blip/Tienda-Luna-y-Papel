function porcentaje(cubiertos, total) {
  return total === 0 ? "100.00" : ((cubiertos * 100) / total).toFixed(2);
}

function resumirArchivo(datos) {
  const sentencias = Object.values(datos.s);
  const funciones = Object.values(datos.f);
  const ramas = Object.values(datos.b).flat();
  const lineasSinEjecutar = Object.entries(datos.s)
    .filter(([, veces]) => veces === 0)
    .map(([id]) => datos.statementMap[id].start.line);
  return {
    sentencias: [sentencias.filter((n) => n > 0).length, sentencias.length],
    funciones: [funciones.filter((n) => n > 0).length, funciones.length],
    ramas: [ramas.filter((n) => n > 0).length, ramas.length],
    lineasSinEjecutar: [...new Set(lineasSinEjecutar)].sort((a, b) => a - b),
  };
}

QUnit.done(() => {
  const cobertura = window.__coverage__ || {};
  const total = { sentencias: [0, 0], funciones: [0, 0], ramas: [0, 0] };
  const filas = [];

  Object.keys(cobertura).sort().forEach((archivo) => {
    const resumen = resumirArchivo(cobertura[archivo]);
    ["sentencias", "funciones", "ramas"].forEach((tipo) => {
      total[tipo][0] += resumen[tipo][0];
      total[tipo][1] += resumen[tipo][1];
    });
    const nombre = archivo.replace(/\\/g, "/").split("/src/")[1];
    filas.push(
      nombre.padEnd(36) +
        porcentaje(...resumen.sentencias).padStart(8) +
        porcentaje(...resumen.ramas).padStart(8) +
        porcentaje(...resumen.funciones).padStart(8) +
        "   lineas sin ejecutar: " +
        (resumen.lineasSinEjecutar.join(", ") || "-")
    );
  });

  const encabezado = "Archivo".padEnd(36) + "Sent %".padStart(8) + "Ram %".padStart(8) + "Func %".padStart(8);
  const final = [
    "TOTAL".padEnd(36) +
      porcentaje(...total.sentencias).padStart(8) +
      porcentaje(...total.ramas).padStart(8) +
      porcentaje(...total.funciones).padStart(8),
    "Sentencias " + total.sentencias.join("/") + " | Ramas " + total.ramas.join("/") + " | Funciones " + total.funciones.join("/"),
  ];
  document.getElementById("cobertura").textContent = [encabezado, ...filas, ...final].join("\n");
});
