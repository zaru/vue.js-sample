var server = require('http').createServer();
var io = require('socket.io')(server);

var redis = require('redis').createClient({ host: 'kvs' });

io.on('connection', function(client){

  redis.get('content', function(err, val) {
    client.emit('content', val);
  });

  client.on('event', function(data){});
  client.on('disconnect', function(){});

  client.on('sync_caret_and_content_to_server', function(data) {

    redis.set('content', data.content);

    client.broadcast.emit('sync_caret_and_content_to_client', {
      user_id: client.id,
      top: data.top,
      left: data.left,
      content: data.content,
      color: data.color
    });
  });
});
server.listen(3000);