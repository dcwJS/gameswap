angular
.module('map.controller',[])
.controller('mapController', function($window, MainService, ProfileServices, AuthServices, MapService, $scope, $parse){


    console.log("INSIDE MAP CONTROLLER!!!!");

    $scope.centerMap = "34.0500, -118.2500";
    $scope.centerObj = {lat: 34, lng: -118};
    $scope.allMaps = {};
    $scope.newLocations = [];

    var latData = [];


    $scope.getLocation = function(){
      ProfileServices.getProfileData().then(function(success){
          var userLocation = success.geoloc;
          var comma = userLocation.indexOf(',');
          var userLat = userLocation.slice(0, comma);
          var userLong = userLocation.slice(comma + 1, userLocation.length);
          $scope.centerObj['lat'] = Number(userLat);
          $scope.centerObj['lng'] = Number(userLong);
          console.log('succss.geoloc +++37', success.geoloc);
          console.log('userLat', $scope.centerMap[0]);
          console.log("centerArray: ", $scope.centerArray);

          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: $scope.centerObj,
            mapTypeId: google.maps.MapTypeId.ROADMAP

          });


          for (var i = 0; i < latData.length; i++) {  

            if (latData[i][0] === latData[latData.length - 1][0]) {
               var marker1 = new google.maps.Marker({
                  position: $scope.centerObj,
                  color: "pink",
                  animation: google.maps.Animation.BOUNCE,
                  map: map,
                  title: "You are here"
  
                });
                marker1.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            } else {

                var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(latData[i][0], latData[i][1]),
                  map: map,
                  animation: google.maps.Animation.DROP,
                });
              
            }


            console.log("****line 53: ", latData[latData.length - 1][0])

          };


      console.log("latData in getLocation: ", latData);

      }, function(err){
        console.log(err);
      })
    };

    $scope.getGeo = function() {
      MapService.getGeo()
      .then(function(results) {
        $scope.allMaps = results;
        console.log(results);
          angular.forEach(results, function(location) {
            var geoLocation = location.geoloc;
            var comma = geoLocation.indexOf(',');
            var lat = Number(geoLocation.slice(0, comma));
            var longi = Number(geoLocation.slice(comma + 1, geoLocation.length));
            latData.push([lat, longi]);
          })
      })
    };




  
    $scope.getGeo();
    $scope.getLocation();


/////////////////////


    var locations = [
      [
          "New Mermaid",
          36.9079,
          -76.199,
          1,
          "Georgia Mason",
          "",
          "Norfolk Botanical Gardens, 6700 Azalea Garden Rd.",
          "coming soon"
      ],
      [
          "1950 Fish Dish",
          36.87224,
          -76.29518,
          2,
          "Terry Cox-Joseph",
          "Rowena's",
          "758 W. 22nd Street in front of Rowena's",
          "found"
      ],
      [
          "A Rising Community",
          36.95298,
          -76.25158,
          3,
          "Steven F. Morris",
          "Judy Boone Realty",
          "Norfolk City Library - Pretlow Branch, 9640 Granby St.",
          "found"
      ],
      [
          "A School Of Fish",
          36.88909,
          -76.26055,
          4,
          "Steven F. Morris",
          "Sandfiddler Pawn Shop",
          "5429 Tidewater Dr.",
          "found"
      ],
      [
          "Aubrica the Mermaid (nee: Aubry Alexis)",
          36.8618,
          -76.203,
          5,
          "Myke Irving/ Georgia Mason",
          "USAVE Auto Rental",
          "Virginia Auto Rental on Virginia Beach Blvd",
          "found"
      ]
    ]
    
    //////////////////////////////////////////////


    // var infowindow = new google.maps.InfoWindow();

    // var marker, i;

    // for (i = 0; i < locations.length; i++) {  
    //   marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    //     map: map
    //   });

    //   google.maps.event.addListener(marker, 'click', (function(marker, i) {
    //     return function() {
    //       infowindow.setContent(locations[i][0], locations[i][6]);
    //       infowindow.open(map, marker);
    //     }
    //   })(marker, i));
    // }


//  marker = new google.maps.Marker({
//     map: map,
//     draggable: true,
//     animation: google.maps.Animation.DROP,
//     position: {lat: 59.327, lng: 18.067}
//   });
//   marker.addListener('click', toggleBounce);
// }

// function toggleBounce() {
//   if (marker.getAnimation() !== null) {
//     marker.setAnimation(null);
//   } else {
//     marker.setAnimation(google.maps.Animation.BOUNCE);
//   }
// }

});
