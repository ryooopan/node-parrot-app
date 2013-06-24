$(function() {

  var host = 'ws://localhost:8888/';
  var socket = new WebSocket(host);
  console.log(socket.readyState);

  socket.onopen = function(){
    console.log(socket.readyState);
  }

  socket.onmessage = function(message){
    var date = new Date();
    $('#list').prepend('<li>' + message.data + '</li>');
    console.log(socket.readyState + ' ' + message.data);
  }

  socket.onclose = function(){
    console.log(socket.readyState);
  }
  
  $(window).unload(function() {
    socket.onclose();
    console.log(socket.readyState);
  })

  $('#btn').on('click',function(){
    message = $('#message').val()
    socket.send(message);
  });

});
