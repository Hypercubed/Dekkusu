
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
       controller: 'DeckCtrl',
       resolve:  { cardList: ['$stateParams', 'FBURL', 'angularFireCollection', function($stateParams, FBURL, angularFireCollection) {

          var ref = new Firebase(FBURL).child('decks/'+$stateParams.username);
          var refCards = ref.child($stateParams.deck+'/cards');

          return angularFireCollection(refCards);
       }]}
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

  app.run(['angularFireAuth', 'FBURL', '$rootScope', 'DEBUG', '$log', '$location',
    function(angularFireAuth, FBURL, $rootScope, DEBUG, $log, $location) {
      //$log.debug($log);
      angularFireAuth.initialize(new Firebase(FBURL), {scope: $rootScope, name: 'user'});
      //$rootScope.user = null;
    }]);

})();
