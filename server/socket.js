var db = require('../database/database');

module.exports = function(io) {
  io.on('connection', function(socket){
    socket.on('disconnect', function(){
      io.emit('user left')
    });

    socket.on('joinRoom', function(room) {
      socket.join(room.lobby);
      io.sockets.in(room.lobby).emit('welcome', room.userName);
    })

    socket.on('sendMsg', function(data) {
      io.sockets.in(data.room).emit('message', data);
    });
  });

}
