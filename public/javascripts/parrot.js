$(function() {

  var socket = io.connect('/');
  socket.on('msg', function (data) {
    $('#list').prepend('<li>' + data.date + ' : ' + data.message + '</li>');
  });

  $('#btn').on('click', function(){
    var message = $('#message').val()
    socket.emit('msg', { message : message });
  });

});
