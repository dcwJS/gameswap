angular
  .module('map.service', [])
  .service('MapService', function($http) {
    this.getGeo = function() {
      return $http.get('/getgeo')
        .then(function(resp) {
          return resp.data;
        }.bind(this), function(error) {
          throw error;
        }.bind(this));
    };
  });