angular.module('auth.signup', [])
.controller('SignupController', function($location, $window, AuthServices, $scope, $http) {

	var user = {};
	var signup = this;

	signup.submit = function(){
		user.username = signup.username;
	 	user.password = signup.password;
	 	user.email = signup.email;
	 	user.city = signup.city;
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

	}
		google.maps.event.addDomListener(window, 'load', postal_code);
		postal_code();


})


