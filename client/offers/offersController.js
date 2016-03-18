angular.module('offers.controller', ['underscore'])
.controller('OffersController', function($http, $scope, _, AuthServices, OffersServices){

  this.init = function() {
    // this.isAuth = AuthServices.isAuth();
    OffersServices.getAllOffers()
    .then(function(offers){
      this.allOffers = offers.data.games;
      this.offers = this.allOffers;
      this.loading = false;
      this.offerFilter = false;
      console.log("They are offering", this.offers)
      if (this.isAuth) {
        //Get logged in user's offers
        this.ownOffers = _.filter(this.offers, function(game){
          return _.some(game.users, function(user) {
            return user.userid === AuthServices.getUserid();
          })
        });
      } else {
        this.ownOffers = [];
      }
    }.bind(this));
    if (this.isAuth) {
      //Get logged in user's wanted games
      OffersServices.getUserWants()
      .then(function(offers){
        this.ownSeeking = offers.data.games;
        console.log("I am seeking", this.ownSeeking)
      }.bind(this));
    }
  }
  var self = this;
  this.loading = true;
  this.selectedGame = {};
  this.selectedUser = {};
  this.userWants= {};
  this.allSeekingByGame = {};
  this.gameMatches = [];

  this.selectGame = function(game) {
    this.selectedGame = game;
    this.selectedUser = this.selectedGame.users[0];
    this.userWants = {};
    this.gameMatches = [];
    //scroll down
    OffersServices.allWillingToSwap(game.id)
    .then(function(wants){
      this.allSeekingByGame = wants.data.games;
      this.userSeeking(this.selectedUser);
    }.bind(this));
  }

  this.userSeeking = function(user) {
    //Get games sought after by selected user
    this.selectedUser = user;
    this.userWants = _.filter(this.allSeekingByGame, function(seeking) {
      return seeking.userid === user.userid
    });
    if (this.isAuth){
      var ownOffers = this.ownOffers;
      this.gameMatches = _.filter(this.userWants, function(game) {
        return _.some(ownOffers, function(ownOffer) {
          return game.id === ownOffer.id;
        })
      })
      console.log("We could trade these games", this.gameMatches)
    }
  }

  this.offeredByYou = function(game) {
    return _.contains(this.gameMatches, game);
  };

  // this.changeOfferView = function(){
  //   console.log("What is the filter?", this.offerFilter)
  //   if (this.offerFilter === "on") {
  //     var ownSeeking = this.ownSeeking;
  //     this.offers = _.filter(this.allOffers, function(offer) {
  //       return _.some(ownSeeking, function(game) {
  //         return game.id === offer.id;
  //       })
  //     });
  //   } else if (this.offerFilter === "") {
  //     this.offers = this.allOffers;
  //   }
  // }

  // $scope.$watch(function(){return self.offerFilter;}, function(value){
  //   console.log("insdie the wathcer", value)
  //   if(value === "on"){
  //     var ownSeeking = self.ownSeeking;
  //     self.offers = _.filter(self.allOffers, function(offer) {
  //       return _.some(ownSeeking, function(game) {
  //         return game.id === offer.id;
  //       })
  //     });
  //     console.log("What is self?", self)
  //   }else if (value === "off"){
  //     self.offers = self.allOffers;
  //   }
  // });

  this.init();

})