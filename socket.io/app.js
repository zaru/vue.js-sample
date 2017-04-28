var redis = require('redis').createClient({ host: 'kvs' });
var url = require("url");
var path = require("path");
var fs = require('fs');
var mime = require('mime-types');
var uuid = require('uuid/v4');

var server = require('http').createServer(function(request, response) {

  var Response = {
    "200":function(file, filename){
      var extname = path.extname(filename);
      var header = {
        "Access-Control-Allow-Origin":"*",
        "Pragma": "no-cache",
        "Cache-Control" : "no-cache"
      }

      response.writeHead(200, header);
      response.write(file, "binary");
      response.end();
    },
    "404":function(){
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();

    },
    "500":function(err){
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(err + "\n");
      response.end();

    }
  };


  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists){
    console.log(filename+" "+exists);
    if (!exists) { Response["404"](); return ; }
    if (fs.statSync(filename).isDirectory()) { filename += '/index.html'; }

    fs.readFile(filename, "binary", function(err, file){
      if (err) { Response["500"](err); return ; }
      Response["200"](file, filename);
    });

  });


});

var io = require('socket.io')(server);

io.on('connection', function(client){

  redis.get('content', function(err, val) {
    client.emit('content', val);
  });

  client.on('event', function(data){});
  client.on('disconnect', function(){
    client.broadcast.emit('remove_caret', {
      user_id: client.id
    });
  });

  client.on('sync_user_to_server', function(data) {
    client.broadcast.emit('sync_user_to_client', {
      user_id: client.id,
      color: data.color
    });
  });

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

  client.on('file_upload', function(data) {
    var writeFile = data.file;
    var ext = mime.extension(data.type);
    var writePath = 'public/images/' + uuid() + '.' + ext;

    var writeStream = fs.createWriteStream(writePath);
    writeStream.on('drain', function () {} )
      .on('error', function (exception) {
        console.log("exception:"+exception);
      })
      .on('close', function () {
        client.emit('file_path_to_client', "http://localhost:3000/" + writePath);
      })
      .on('pipe', function (src) {});

    writeStream.write(writeFile,'binary');
    writeStream.end();
  });
});
server.listen(3000);