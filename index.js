var Hapi = require('hapi');
var ends = require('./endpoints');
var ports = require('./portconfig.json');
var chat_broker = require('./chat_broker');

var server= new Hapi.Server();

server.connection(ports.page).route(ends.page);
server.connection(ports.chat).route(ends.chatpage);

server.register({register: chat_broker, options: ports.chat.labels}, function (err) {
  if (err) {
    throw err;
  }
});
server.start(function() {
  console.log('Server started');
});
