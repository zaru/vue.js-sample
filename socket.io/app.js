var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('event', function(data){});
  client.on('disconnect', function(){});

  client.on('client_to_server', function(data) {
    console.log(client.id);
    io.sockets.emit('server_to_client', { user_id: client.id, top: data.top, left: data.left });
  });
});
server.listen(3000);