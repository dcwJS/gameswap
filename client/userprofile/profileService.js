angular.module('profile.service', [])

.factory('ProfileServices', function($http, $window){

  var getProfileData = function(){
    var token = $window.localStorage.getItem('com.gameswap');

    return $http({
      method: 'POST',
      url: '/profile',
      data: {token: token}
    })
    .then(function(resp){
      return resp.data;
    }, function(error) {
      console.error('ERROR in getProfileData: ', error);
    })
  };

  var addGameOffering = function(game){
    var token = $window.localStorage.getItem('com.gameswap');

    return $http({
      method: 'POST',
      url: '/addtoofferings',
      data: {game: game, token: token}
    })
    .then(function(resp){
      return resp;
    }, function(error) {
      console.error('ERROR!!! ', error);
    })

  };

  var addGameSeeking = function(game){
    var token = $window.localStorage.getItem('com.gameswap');

    return $http({
      method: 'POST',
      url: '/addtoseeking',
      data: {game: game, token: token}
    })
    .then(function(resp){
      return resp;
    }, function(error) {
      console.error('ERROR!!! ', error);
    })
  };

  var updateProfile = function(data){
    var update = {
      phone: data.phone || "",
      street: data.street || "",
      city: data.city || "",
      state: data.state || "",
      zip: data.zip || "",
      geoloc: data.geoloc || "",
      profilepic: data.profilepic || ""
    };

    var token = $window.localStorage.getItem('com.gameswap');

    return $http({
      method: 'PUT',
      url: '/profile/update',
      data: {user: update,
        token: token}
      })
      .then(function(resp){
        return resp;
      }, function(error) {
        console.error('ERROR!!! ', error);
      });
  };

  var searchGiantBombGames = function(gameQuery){
    console.log(gameQuery);

    var url = 'http://www.giantbomb.com/api/search/?api_key=' + 'e52320a1909ae309572083292e6a7f818b4a7322' + '&query=' + gameQuery.title +'&resources=game&format=json'
    url = 'http://www.giantbomb.com/api/search/?api_key=' + 'e52320a1909ae309572083292e6a7f818b4a7322' + '&format=json&query=' + gameQuery.title +'&resources=game'

    return $http({
      method: 'JSONP',
      url: url,
      params: {
        format: 'jsonp',
        json_callback: 'JSON_CALLBACK'
      }
    })
    .then(function(gamelist){

      console.log('List of games: ' + gamelist);
      var gameResults = {};
      var gameArray = [];
      angular.forEach(gamelist.data.results, function(game){
        angular.forEach(game.platforms, function (platform) {
          if (platform.name == gameQuery.platform) {
            game.userPlatform = gameQuery.platform;
            gameResults[game.name] = {
              name: game.name,
              platform: gameQuery.platform,
              image: game.image.thumb_url,
              id: game.id
            }
            game.platform = gameQuery.platform;
          }
        });
      });
      for(var key in gameResults){
        gameArray.push(gameResults[key]);
      }
      return gameArray;
    })
  }

  return {
    getProfileData: getProfileData,
    addGameOffering: addGameOffering,
    addGameSeeking: addGameSeeking,
    updateProfile: updateProfile,
    searchGiantBombGames: searchGiantBombGames
  };
});
