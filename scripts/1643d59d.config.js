
(function() {
  var app = angular.module('mainApp',
      ['ui.router','ui.bootstrap', 'ui.keypress', 'ui.event', 'ngSanitize', 'firebase','ngAnimate']);

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

    // Deal with missing trailing slash
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path(), search = $location.search(), params;

      if (path[path.length - 1] !== '/') {
        return;
      }

      if (Object.keys(search).length === 0) {
        return path.slice(0,path.length-1);
      }

      params = [];
      angular.forEach(search, function(v, k){
        params.push(k + '=' + v);
      });
      return path + '?' + params.join('&');
    });

    $stateProvider
    .state('home', {
      url: "/",
      templateUrl: 'partials/homeView.html',
      controller: 'HomeCtrl'
    })
    .state('user', {
      abstract: true,
      url: "/:username",
      templateUrl: 'partials/userView.html',
      controller: 'userViewCtrl'
    })
    .state('user.deckList', {
      url: '',
      templateUrl: 'partials/user.deckList.html',
      controller: 'DeckListCtrl'
    })
    .state('user.deck', {
       abstract: true,
       url: "/:deck",
       templateUrl: 'partials/user.deckView.html',
       controller: 'DeckCtrl'
    })
    .state('user.deck.cardList', {
       url: "",
       templateUrl: 'partials/user.deck.cardList.html',
       controller: 'DeckCtrl'
    })
    .state('user.deck.card', {
      url: "/:id",
      templateUrl: 'partials/user.deck.cardView.html',
      controller: 'cardViewCtrl'
    })
    ;

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

  app.run(['$firebaseAuth', 'FBURL', '$rootScope', 'DEBUG', '$log', '$location',
    function($firebaseAuth, FBURL, $rootScope, DEBUG, $log, $location) {
      var ref = new Firebase(FBURL);
      $rootScope.auth = $firebaseAuth(ref);
    }]);

  app.run(['$rootScope','SITE', function($rootScope,SITE) {
    $rootScope.site = SITE;
  }]);

})();
