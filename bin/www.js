#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('chat:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

//Codigo JS de la parte servidor
const io = require('socket.io')(server);

io.on('connection', (socket) => {
console.log('Se ha conectado un nuevo cliente');
console.log('CLIENTES', io.engine.clientsCount);
//emite mensaje a todos menos al que se conecta
socket.broadcast.emit('mensaje_chat',{
	nombre: 'INFO',
	mensaje:'Se ha conectado un nuevo usuario'
});

//Emitir el numero de clientes conectados
io.emit('clientes_chat', io.engine.clientsCount);

//Socket detecta un mensaje del chat y ejecuta la funcion con los datos emitidos
socket.on('mensaje_chat', (data)=>{
console.log(data);
io.emit('mensaje_chat',data)
});

//Cuando se pierde la conexion
socket.on('disconnect',() =>{
io.emit('mensaje_chat',{
	nombre: 'INFO',
	mensaje:'Se ha desconectado un usuario'
});
io.emit('clientes_chat', io.engine.clientsCount);
});

});
/**
 * Listen on provided port, on all network interfaces.
 */


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
