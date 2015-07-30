var handle = require('./handlers');
var socketio = require('socket.io')

exports.register = function (server, options, next) {
    var io = socketio(server.select(options).listener);
    io.sockets.on('connection', function(socket){
        socket.on('new message', function(msg){
            handle.message(socket, msg);
        });
        socket.on('join', function(username, position, radius){
            handle.join(socket, username, position, radius);
        });
        socket.on('typing', function(){
            handle.typing(socket);
        });
        socket.on('stop typing', function () {
            handle.stoptyping(socket);
        });
        socket.on('disconnect', function () {
            handle.disconnect(socket);
        });
    });
    next();
};

exports.register.attributes = {
    name: 'chat-broker'
};