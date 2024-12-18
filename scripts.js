$(document).ready(function () {
    const tarifasBase = {
        DHL: 5.0,
        Estafeta: 4.5,
        Multipack: 4.0,
        Fedex: 6.0,
    };

    const factoresVolumetricos = {
        DHL: 5000,
        Estafeta: 6000,
        Multipack: 5500,
        Fedex: 7000,
    };

    // Configuración inicial
    $('#paso1').addClass('activo');

    // Validar y mover entre pasos
    $('#botonSiguiente1').click(function () {
        const peso = parseFloat($('#peso').val());
        const dimensiones = $('#dimensiones').val().split('x').map(Number);

        if (peso > 0 && dimensiones.length === 3 && dimensiones.every(d => d > 0)) {
            $('#paso1').removeClass('activo').addClass('d-none');
            $('#paso2').removeClass('d-none').addClass('activo');
        } else {
            alert('Por favor, completa todos los campos correctamente.');
        }
    });

    $('#botonAtras1').click(function () {
        $('#paso2').removeClass('activo').addClass('d-none');
        $('#paso1').removeClass('d-none').addClass('activo');
    });

    $('#botonSiguiente2').click(function () {
        if ($('#servicio').val()) {
            $('#paso2').removeClass('activo').addClass('d-none');
            $('#paso3').removeClass('d-none').addClass('activo');
        } else {
            alert('Selecciona un servicio.');
        }
    });

    $('#botonAtras2').click(function () {
        $('#paso3').removeClass('activo').addClass('d-none');
        $('#paso2').removeClass('d-none').addClass('activo');
    });

    $('#formularioEnvio').submit(function (e) {
        e.preventDefault();
        $('#paso3').removeClass('activo').addClass('d-none');
        $('#mensajeExito').removeClass('d-none').addClass('activo');
    });

    // Calcular y mostrar el precio estimado
    $('#servicio').change(function () {
        const servicio = $(this).val();
        const pesoReal = parseFloat($('#peso').val());
        const dimensiones = $('#dimensiones').val().split('x').map(Number);

        if (!servicio) {
            $('#textoPrecio').text('Selecciona un servicio para ver el precio.');
            return;
        }

        if (pesoReal <= 0 || dimensiones.length !== 3 || dimensiones.some(d => d <= 0)) {
            $('#textoPrecio').text('Por favor, ingresa valores válidos para peso y dimensiones.');
            return;
        }

        const largo = dimensiones[0];
        const ancho = dimensiones[1];
        const alto = dimensiones[2];
        const factor = factoresVolumetricos[servicio] || 5000; // Valor por defecto
        const pesoVolumetrico = (largo * ancho * alto) / factor;

        // Usar el peso mayor (real o volumétrico)
        const pesoCalculado = Math.max(pesoReal, pesoVolumetrico);

        // Calcular el precio
        let precio = tarifasBase[servicio] * pesoCalculado;

        // Incremento por peso mayor a 10 kg
        if (pesoCalculado > 10) {
            precio += precio * 0.25; // Incremento del 25%
        }

        // Mostrar el precio redondeado
        precio = precio.toFixed(2);
        $('#textoPrecio').text(`Precio estimado: $${precio} (Peso utilizado: ${pesoCalculado.toFixed(2)} kg)`);
    });
});
