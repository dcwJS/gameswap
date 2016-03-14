angular
  .module('app', [
  	'main.controller',
  	'main.service',
  	'userprofile',
  	'profile.service',
  	'auth.signin',
  	'auth.signup',
  	'auth.service',
  	'ui.router',
    'messages.controller',
    'messages.service',
    'index.controller',
    'index.services',
    'map.controller',
    'map.service'])

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

	  $urlRouterProvider.otherwise('/');

	  $stateProvider
		  .state('main', {
			  url: '/',
			  templateUrl: './main/main.html',
		  })
		  .state('signin', {
			  url: '/signin',
			  templateUrl: './auth/signin/signin.html',
		  })
		  .state('signup', {
			  url: '/signup',
			  templateUrl: './auth/signup/signup.html',
		  })
		  .state('userprofile', {
			  url: '/userprofile',
		    templateUrl: './userprofile/userprofile.html',
        authenticate: true
		  })
      .state('map', {
        url:'/map',
        templateUrl:'./map/map.html'
      })
      .state('messages', {
        url: '/messages',
        templateUrl: './messages/messages.html',
        authenticate: true
      });

	  $httpProvider.interceptors.push('AttachTokens');

})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.gameswap');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, AuthServices, IndexServices) {
  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
    IndexServices.checkState();
    if (toState.authenticate && !AuthServices.isAuth()) {
      e.preventDefault();
      $location.path('/signin');      
    }
  });
});
