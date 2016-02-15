var db = require('../database/database');

module.exports = function(io) {
  io.on('connection', function(socket){
    socket.on('disconnect', function(){
      io.emit('user left')
      console.log('user disconnected');
    });

    socket.on('joinRoom', function(room) {
      console.log('join room: ', room);
      socket.join(room.lobby);
      io.sockets.in(room.lobby).emit('welcome', room.userName);
    })

    socket.on('sendMsg', function(data) {
      console.log('sending message', data);
      io.sockets.in(data.room).emit('message', data.msg);
    });
  });

}
