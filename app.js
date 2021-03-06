
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/

var server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);
var fs = require('fs');

server.listen(app.get('port'), function(){
  console.log("server listening on port " + app.get('port'));
});

var socks = []
var body = '';
fs.readFile('index.html', 'utf8', function(err, data) {
  body = data;
  //console.log(body);
});

io.sockets.on('connection', function (socket) { 
  var address = socket.handshake.address;
  console.log("connected from " + address.address + ":" + address.port);
  
  socket.on('msg', function(data){
    console.log(data);
    var date = new Date();
    io.sockets.emit("msg", {date : date, message : data.message});
  });

  socket.emit('refresh', {body: body});

  socket.on('refresh', function (body_) {
    console.log('new body');
    body = body_;
  });

  socket.on('change', function (op) {
    console.log(op);
    if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
      socket.broadcast.emit('change', op);
    }
  });

  socket.on('cursor', function (pos) {
    console.log(pos);
    socket.broadcast.emit('cursor', pos);
  });
  
  socket.on('disconnect', function () {
    console.log("disconnectted from " + address.address + ":" + address.port) 
  });
  
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
