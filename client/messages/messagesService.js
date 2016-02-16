angular
  .module('messages.service', [])
  .service('MessagesService', function($http, $window) {
    this.sendMessage = function(message) {
      var token = $window.localStorage.getItem('com.gameswap');
      return $http.post('/addmessage', {message: message, token: token})
        .then(function(resp) {
          return resp.data;
        }.bind(this), function(error) {
          throw error;
        }.bind(this));
    };
    this.getRooms = function() {
      var token = $window.localStorage.getItem('com.gameswap');
      return $http.get('/getrooms', {token: token})
        .then(function(resp) {
          return resp.data;
        }.bind(this), function(error) {
          throw error;
        }.bind(this));
    };
    this.makeRoom = function(userone, usertwo) {
      return $http({
        method: 'POST',
        url: '/api/chatroom',
        data: {
          users: {userone: userone, usertwo: usertwo}
        }
      })
        .then(function(resp) {
          console.log(resp);
          return resp;
        }.bind(this), function(error) {
          throw error;
        }.bind(this));
    };

    this.getUsernameByEmail = function(email) {
      return $http({
        method: 'GET',
        url: '/recipient',
        params: {
          email: email
        }
      })
        .then(function(resp) {
          return resp.data.results;
        }.bind(this), function(error) {
          throw error;
        }.bind(this)); 
    }
  });
