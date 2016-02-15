angular
  .module('messages.controller', [])
  .controller('MessagesController', function ($rootScope, $window, MainService, MessagesService, ProfileServices) {
    this.toId = MainService.getRecipientId();
    this.toName = MainService.getRecipientName();
    this.lobby = [];
    this.receiveMessageText = [];
    this.socket = io();
    this.userInfo = {};
    this.rootScope = $rootScope;

    this.socket.on('message', function(msg){
      this.rootScope.$apply(function () {
        this.receiveMessageText.push(msg);
      }.bind(this))
    }.bind(this))

    this.socket.on('welcome', function(user){
      this.rootScope.$apply(function () {
        this.receiveMessageText.push("welcome " + user);
      }.bind(this))
    }.bind(this))

    this.loadMessage = function(msg) {
      this.receiveMessageText.push(msg);
    }

    this.joinLobby = function (lobby) {
      var lobbyInfo = {
        lobby: lobby,
        userName: this.userInfo.username
      }
      console.log(lobbyInfo);
      this.socket.emit('joinRoom', lobbyInfo);
      this.currentLobby = lobby;
    }

    this.sendMessage = function () {
      if(this.currentLobby){
        this.socket.emit('sendMsg', {room: this.currentLobby, msg: this.messageText});
      }
      this.messageText = "";
    };

    this.getRooms = function () {
      MessagesService.getRooms()
      .then(function(data){
        for(var i = 0;i < data.results.length; i++){
          this.lobby.push(data.results[i].lobby);
        }
        console.log(this.lobby);
      }.bind(this));
    };

    this.getUser = function () {
      ProfileServices.getProfileData()
        .then(function (resp) {
          this.username = resp.username;
        }.bind(this));
    };

    this.reply = function (userid, username) {
      this.toId = userid;
      this.toName = username;
      $window.document.getElementById('messageText').focus();
    };

    this.makeRoom = function () {
      MessagesService.makeRoom(this.toName, this.userInfo.username);
    };

    this.loadProfile = function() {
      ProfileServices.getProfileData()
        .then(function(resp) {
          this.userInfo.username = resp.username;
          this.userInfo.email = resp.email;
          this.userInfo.city = resp.city || 'santa monica';
          this.userInfo.gamesOffered = resp.offerings;
          this.userInfo.gamesSeeking = resp.seeking;
          this.getRooms();
          if(this.toName){
            this.makeRoom();
          }
        }.bind(this));
    };

    this.loadProfile();

});
