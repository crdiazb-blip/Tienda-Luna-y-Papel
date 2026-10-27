const formulario = document.getElementById("formularioPedido");

if (formulario) {
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        limpiarFormulario();

        const nombre = document.getElementById("nombre");
        const correo = document.getElementById("correo");
        const producto = document.getElementById("producto");
        const cantidad = document.getElementById("cantidad");
        let datosCorrectos = true;

        if (nombre.value.trim().length < 3) {
            mostrarError(nombre, "errorNombre", "Escribe tu nombre completo.");
            datosCorrectos = false;
        } else {
            marcarCorrecto(nombre);
        }

        if (!correo.value.includes("@") || !correo.value.includes(".")) {
            mostrarError(correo, "errorCorreo", "Escribe un correo válido.");
            datosCorrectos = false;
        } else {
            marcarCorrecto(correo);
        }

        if (producto.value === "") {
            mostrarError(producto, "errorProducto", "Selecciona un producto.");
            datosCorrectos = false;
        } else {
            marcarCorrecto(producto);
        }

        if (cantidad.value < 1 || cantidad.value > 10) {
            mostrarError(cantidad, "errorCantidad", "La cantidad debe estar entre 1 y 10.");
            datosCorrectos = false;
        } else {
            marcarCorrecto(cantidad);
        }

        const resultado = document.getElementById("resultado");

        if (datosCorrectos) {
            const total = Number(producto.value) * Number(cantidad.value);
            resultado.textContent = "Pedido recibido. Total: $" + total.toLocaleString("es-CL");
            resultado.className = "exito";
        } else {
            resultado.textContent = "Revisa los campos marcados.";
            resultado.className = "error";
        }
    });

    formulario.addEventListener("reset", function () {
        setTimeout(limpiarFormulario, 0);
    });
}

function mostrarError(campo, idMensaje, texto) {
    campo.classList.add("incorrecto");
    document.getElementById(idMensaje).textContent = texto;
}

function marcarCorrecto(campo) {
    campo.classList.add("correcto");
}

function limpiarFormulario() {
    const campos = document.querySelectorAll("input, select");
    const mensajes = document.querySelectorAll("small");

    campos.forEach(function (campo) {
        campo.classList.remove("correcto", "incorrecto");
    });

    mensajes.forEach(function (mensaje) {
        mensaje.textContent = "";
    });

    const resultado = document.getElementById("resultado");
    if (resultado) {
        resultado.textContent = "";
        resultado.className = "";
    }
}
