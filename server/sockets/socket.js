const { io } = require('../server');
const { Usuario } = require('../classes/usuarios');
const { mensajeGeneral } = require('../utils/servicios-utilidades');

const usuarios = new Usuario();

io.on('connection', (client) => {
    client.on('entrarChat', (info, callback) => {
        //if (!info.nombre || !info.sala) {
        if (!info.nombre) {
            return callback({
                error: true,
                mensaje: 'Para entrar se requiere introducir un nombre'
            });
        }
        //console.log(info);

        client.join(info.sala);

        let personas = usuarios.agregarPersona(client.id, info.nombre, info.sala);

        let connectionMsg = 'El usuario ' + info.nombre + ' se unió al chat.'

        // Los comentados se muestran a todos absolutamente.
        // client.broadcast.emit('mensajeGeneral', mensajeGeneral('Administrador', connectionMsg));
        // client.broadcast.emit('listaPersonas', usuarios.getPersonas());

        client.broadcast.to(info.sala).emit('mensajeGeneral', mensajeGeneral('Administrador', connectionMsg));
        client.broadcast.to(info.sala).emit('listaPersonas', usuarios.getPersonasPorSala(info.sala));

        //callback(personas);
        callback(usuarios.getPersonasPorSala(info.sala));
    });

    client.on('mensajeGeneral', (msg) => { // Paréntesis no obligatorio si envío un solo argumento.
        let hablante = usuarios.getPersona(client.id);
        let mensaje = mensajeGeneral(hablante.nombre, msg.mensaje);
        // Este se muestra a todos absolutamente:
        // client.broadcast.emit('mensajeGeneral', mensaje);
        // Este ya es filtrado a la sala correspondiente:
        client.broadcast.to(hablante.sala).emit('mensajeGeneral', mensaje);
    });

    client.on('mensajePrivado', msg => { // Ejemplo del paréntesis opcional.
        let hablante = usuarios.getPersona(client.id);
        client.broadcast.to(msg.para).emit('mensajePrivado', mensajeGeneral(hablante.nombre, msg.mensaje));
    });

    client.on('disconnect', () => {
        let usuarioDesconectado = usuarios.borrarPersona(client.id);
        let disconnectionMsg = 'El usuario ' + usuarioDesconectado.nombre + ' salió del chat.';
        console.log(disconnectionMsg);
        client.broadcast.to(usuarioDesconectado.sala).emit('mensajeGeneral', mensajeGeneral('Administrador', disconnectionMsg));
        client.broadcast.to(usuarioDesconectado.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuarioDesconectado.sala));
    });
});