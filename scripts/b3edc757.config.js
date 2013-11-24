
(function() {
  var app = angular.module('mainApp',
      ['ngRoute','ui.bootstrap', 'ui.keypress', 'ui.event', 'ngSanitize', 'firebase','ngAnimate']);

  app
    .constant('FBURL', 'https://dekkusu.firebaseio.com/')
    .constant('DEBUG', false);

  app.config(['$provide', '$routeProvider', function($provide, $routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'partials/homeView.html',
          controller: 'HomeCtrl'
        }).
        when('/:username', {
          templateUrl: 'partials/deckListView.html',
          controller: 'DeckListCtrl'
        }).
        when('/:username/:deck', {
          templateUrl: 'partials/deckView.html',
          controller: 'DeckCtrl'
        }).
        otherwise({
          redirectTo: '/'
        });

    }]);

  app.config(['$logProvider', 'DEBUG',function($logProvider, DEBUG) {
      $logProvider.debugEnabled(DEBUG);
    }]);

  app.run(['angularFireAuth', 'FBURL', '$rootScope', 'DEBUG', '$log', '$location',
    function(angularFireAuth, FBURL, $rootScope, DEBUG, $log, $location) {
      //$log.debug($log);
      angularFireAuth.initialize(new Firebase(FBURL), {scope: $rootScope, name: 'user'});
      //$rootScope.user = null;
    }]);

})();
