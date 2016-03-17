angular.module('userprofile', [])
  .controller('ProfileController', function(AuthServices, ProfileServices, $scope){

    var userInfo = this;

    this.gamesOffered = [];
    this.gamesSeeking = [];
    this.updateClicked = false;
    $scope.gamesList = [];

    var loadProfile = function() {
      ProfileServices.getProfileData()
        .then(function(resp) {
          userInfo.username = resp.username;
          userInfo.email = resp.email;
          userInfo.city = resp.city || 'santa monica';
          userInfo.gamesOffered = resp.offerings;
          userInfo.gamesSeeking = resp.seeking;
          console.log('++++line 18: ', resp);
        });
    };

    this.searchGames = function(gameQuery) {
      ProfileServices.searchGiantBombGames(gameQuery)
      .then(function(results){
        console.log(results);
        $scope.gamesList = results;
      });
    }

    this.toggleUpdate = function(){
      if(!this.updateClicked) {
        this.updateClicked = true;
      } else {
        this.updateClicked = false;
      }
    };

    this.submitUpdate = function(update) {
      ProfileServices.updateProfile(update)
        .then(function(resp){

          setTimeout(loadProfile, 200);

        });
      this.toggleUpdate();
    };

  	this.addOffer = function(game) {
      if(game.platform){
        ProfileServices.addGameOffering({
  			  title: game.name,
  			  platform: game.platform,
          image: game.image
  			}).then(function(resp){

          setTimeout(loadProfile, 200);
        });
      } else {
        console.log('ERROR: no platform chosen');
        this.noOffPlatform = true;         
      }
  	};

  	this.addSeek = function(game) {
      console.log(game);
      if(game.platform){
        ProfileServices.addGameSeeking({
          title: game.name,
          platform: game.platform,
          image: game.image 
        }).then(function(resp){

          setTimeout(loadProfile, 200);
        });
      } else {
        console.log('ERROR: no platform chosen');
        this.noSeekPlatform = true;  
      }
  	};

  	this.signOut = function(){
  		AuthServices.signOut();
  	}

    loadProfile();
  
  })
