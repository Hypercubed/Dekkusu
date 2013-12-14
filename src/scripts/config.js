
(function() {
  var app = angular.module('mainApp',
      ['ui.router','ngRoute', 'ui.bootstrap', 'ui.keypress', 'ui.event', 'ngSanitize', 'firebase','ngAnimate']);

  app
    .constant('FBURL', 'https://dekkusu.firebaseio.com/')
    .constant('DEBUG', false)
    .constant('SITE', {
      title: 'Dekkusu',
      company: 'J. Harshbarger',
      year: '2013'
    });

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('home', {
      url: "/",
      templateUrl: 'partials/homeView.html',
      controller: 'HomeCtrl'
    })
    .state('user', {
      url: "/:username",
      templateUrl: 'partials/userView.html',
      controller: 'DeckListCtrl'
    })
    .state('user.deckList', {
      url: "/",
      templateUrl: 'partials/user.deckList.html',
      controller: 'DeckListCtrl'
    })
    .state('user.deck', {
      url: "/:deck",
      templateUrl: 'partials/user.deckView.html',
      controller: 'DeckCtrl'
    })
    .state('user.deck.cardList', {
      url: "/",
      templateUrl: 'partials/user.deck.cardList.html',
      controller: 'DeckCtrl'
    })
    .state('user.deck.card', {
      url: "/:index",
      templateUrl: 'partials/user.deck.cardView.html',
      controller: 'DeckCtrl'
    });

    // TODO: user.deck.study

      /* $routeProvider.
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
        }); */

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
