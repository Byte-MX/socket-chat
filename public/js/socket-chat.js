var socket = io();

var params = new URLSearchParams(window.location.search);

//if (!params.has('nombre') || !params.has('sala')) {
if (!params.has('nombre')) {
    window.location = 'index.html';
    throw new Error('Se requiere un nombre de usuario');
}

var sala = 'General';
if (params.has('sala') && params.get('sala').trim() !== '') {
    sala = params.get('sala');
}
var usuario = {
    nombre: params.get('nombre'),
    sala
}

// Escuchar respuesta a mi solicitud (automática) de conexión.
socket.on('connect', function() {
    //console.log('params:' + params);
    console.log('Sala elegida: ' + sala);
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados: ', resp);
    });
});

// Escuchar desconexión del servidor.
socket.on('disconnect', function() {
    console.log('Se perdió la conexión con el servidor');
});

// Escuchar un mensaje general
socket.on('mensajeGeneral', function(msg) {
    console.log(msg.nombre + ': ' + msg.mensaje + '\n(' + new Date(msg.fecha) + ')');
});

// Escuchar la lista de usuarios
socket.on('listaPersonas', function(msg) {
    /* var todos = '';
     for (usuario in msg) {
         todos += usuario.nombre;
     }
     console.log('Usuarios conectados: ', todos);*/
    console.log('Usuarios conectados: ', msg);
});

// Mensaje privado
socket.on('mensajePrivado', function(msg) {
    console.log('[Mensaje privado de ' + msg.nombre + ']: ' + msg.mensaje + '\n (' + new Date(msg.fecha) + ')');
});

// Enviar información
/*
socket.emit('mensajeGeneral', {
    usuario: usuario.nombre,
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('Respuesta server: ', resp);
});*/