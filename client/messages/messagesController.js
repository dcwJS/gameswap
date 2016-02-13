angular
  .module('messages.controller', [])
  .controller('MessagesController', function ($window, MainService, MessagesService, ProfileServices) {
    this.toId = MainService.getRecipientId();
    this.toName = MainService.getRecipientName();
    this.sendMessage = function (messageText, to) {
      MessagesService.sendMessage({
            text: messageText,
            to: to
      })
      .then(function(){
        // this.getMessages();
      }.bind(this));
    };

    this.getMessages = function () {
      // MessagesService.getMessages()
      // .then(function(data){
      //   this.messageHistory = null;
      //   this.messageHistory = data.results;
      // }.bind(this));
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
    
    this.makeRoom = function (user) {
      MessagesService.makeRoom(user);
    };

    this.getUser();
    // this.getMessages();
    this.makeRoom();
});
