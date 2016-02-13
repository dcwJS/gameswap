angular.module('auth.signup', [])
.controller('SignupController', function($location, $window, AuthServices, $scope, $http) {
	// $scope.user = {};
	var user = {};
	var signup = this;
	var places;

	// var city;

	signup.submit = function(){
		user.username = signup.username;
	 	user.password = signup.password;
	 	user.email = signup.email;
	 	//user.city.name = only zipcode
	 	//user.city.formatted_address = city,zip,us
	 	user.city = places.address_components[1].long_name;
	 	console.log('+++line 13:', places)
	 	AuthServices.submitNewUser({user: user})
	 		.then(function(token){
	 		  if(token){
        		$location.path('/userprofile');
        	  }	else {
        	  	console.log('Error authenticating user - email already taken');
        	  	signup.email = '';
        	  	signup.password = ''; // clear the fields
        	  	signup.emailExistsInDb = true;
        	  }
	 		})
	 		.catch(function(error) {
        		console.error(error);
      		}); 	
	}

	var postal_code = function () {
	    var input = document.getElementById('auto-zipcode');
	    var options = {
	        types: ['(regions)'],
	        componentRestrictions: {
	            country: "usa"
	        }
	    }

	    var autocomplete = new google.maps.places.Autocomplete(input, options);

	    autocomplete.addListener('place_changed', function() {
	    	places = autocomplete.getPlace();
	    });


	}

	$scope.init = function() {
		postal_code();
		google.maps.event.addDomListener(window, 'load', postal_code);
	}	

	$scope.init();


})


