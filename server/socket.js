var db = require('../database/database');
var util = require('util');

module.exports = function(io) {
  io.on('connection', function(socket){
    socket.on('disconnect', function(){
      io.emit('user left')
    });

    socket.on('joinRoom', function(room) {
      console.info('___ New client ' + socket.id + ' connected to ' + room.lobby.lobbyid);
      console.log('+++ line11 data emit: ' + util.inspect(room, false, null));
      socket.join(room.lobby);
      db.loadMessages(room.lobby.lobbyid, function(messages){
        console.log('+++ line14 data emit: ' + util.inspect(messages, false, null));
        io.to(socket.id).emit('load', messages);
      });
    })

    socket.on('sendMsg', function(data) {
      console.log('+++ line16 data emit: ' + util.inspect(data, false, null));
      db.addMessage(data.msg, data.user, data.room.lobbyid);
      io.sockets.in(data.room).emit('message', data);
    });
  });

}
