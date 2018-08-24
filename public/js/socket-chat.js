var socket = io();

var params = new URLSearchParams(window.location.search);

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
    socket.emit('entrarChat', usuario, function(resp) {
        renderizarUsuarios(resp);
    });
});

// Escuchar desconexión del servidor.
socket.on('disconnect', function() {
    console.log('Se perdió la conexión con el servidor');
});

// Escuchar un mensaje general
socket.on('mensajeGeneral', function(msg) {
    renderizarMensajes(msg, false);
    scrollBottom();
});

// Escuchar la lista de usuarios
socket.on('listaPersonas', function(info) {
    renderizarUsuarios(info);
});

// Mensaje privado
socket.on('mensajePrivado', function(msg) {
    console.log('[Mensaje privado de ' + msg.nombre + ']: ' + msg.mensaje + '\n (' + new Date(msg.fecha) + ')');
});