angular
.module('map.controller',[])
.controller('mapController', function($window, MainService, ProfileServices, AuthServices, $scope, $parse){


    console.log("INSIDE MAP CONTROLLER!!!!");

    $scope.centerMap = "34.0500, -118.2500";


    $scope.getLocation = function(){
      ProfileServices.getProfileData().then(function(success){
        console.log("mapController ln 10. Success:", success);
        $scope.centerMap = success.geoloc;
        console.log("mapController ln 12. $scope.centerMap =", $scope.centerMap);
      }, function(err){
        console.log(err);
      })
    }

    var initialize = function() {
      var mapProp = {
        center:new google.maps.LatLng($scope.centerMap),
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    }

    $scope.getLocation();

    google.maps.event.addDomListener(window, 'load', initialize);


})