angular.module('offers.services', [])

.factory('OffersServices', function($q, $http, $rootScope, $location, $anchorScroll){

  var getAllOffers = function() {
    var q = $q.defer();
    $http.get($rootScope.url + "/allOfferings")
    .then(function(offers){
      q.resolve(offers);
    }, function(err){
      q.resolve(err);
    })
    return q.promise;
  }

  var allWillingToSwap = function(gameid) {
    var q = $q.defer();
    $http.get($rootScope.url + "/allWillingToSwap?gameid=" + gameid)
    .then(function(wants){
      q.resolve(wants);
    }, function(err){
      q.resolve(err);
    })
    return q.promise;
  }

  var getUserOffers = function() {
    var q = $q.defer();
    $http.get($rootScope.url + "/allOfferingByUser")
    .then(function(offers){
      q.resolve(offers);
    }, function(err){
      q.resolve(err);
    })
    return q.promise;
  }

  var getUserWants = function() {
    var q = $q.defer();
    $http.get($rootScope.url + "/allSeekingByUser")
    .then(function(wants){
      q.resolve(wants);
    }, function(err){
      q.resolve(err);
    })
    return q.promise;
  }

  return {
    getUserOffers: getUserOffers,
    getAllOffers: getAllOffers,
    getUserWants: getUserWants,
    allWillingToSwap: allWillingToSwap
  }
})