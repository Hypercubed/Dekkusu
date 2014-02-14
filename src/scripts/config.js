
(function() {
  var app = angular.module('mainApp',
      ['ui.router','ui.bootstrap', 'ui.keypress', 'ui.event', 'ngSanitize', 'firebase','ngAnimate','angularLocalStorage','ngDragDrop']);

  app


  if (window.location.hostname == "127.0.0.1") {
    app
      .constant("ENV", "development")
      .constant('FBURL','https://dekkusu.firebaseio.com/')
      .constant('DEBUG', true)
      .constant('SITE', {
        title: 'Dekkusu - Dev',
        company: 'J. Harshbarger',
        year: '2013'
      });
  } else {
    app
      .constant("ENV", "production")
      .constant('FBURL','https://dekkusu-prod.firebaseio.com/')
      .constant('DEBUG', false)
      .constant('SITE', {
        title: 'Dekkusu',
        company: 'J. Harshbarger',
        year: '2013'
      });
  };

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
    .state("authroot", {
      abstract: true,
      url: "",
      controller: 'HomeCtrl',
      resolve: {  currentUser: ['userAuth',function(userAuth) { return userAuth.$getCurrentUser(); } ] },
      templateUrl: 'partials/rootView.html'
    })
    .state('authroot.home', {
      url: "/",
      templateUrl: 'partials/homeView.html',
    })
    .state('authroot.user', {  // Rename to set?
      abstract: true,
      url: "/:username",  // TODO: username -> path?
      templateUrl: 'partials/userView.html',
      controller: 'userViewCtrl',
      resolve: { rootIds: ['$stateParams','deckManager', function($stateParams, deckManager) {
        return deckManager.getChildren($stateParams.username);
      }] }
    })
    .state('authroot.user.deckList', {
      url: '',
      templateUrl: 'partials/user.deckList.html',
      controller: 'userDeckListCtrl',
      resolve: { deck: ['$stateParams','deckManager', function($stateParams, deckManager) {
        return deckManager.getDeck($stateParams.username);
      }] }
    })
    .state('authroot.user.deck', {
      url: "/:deck",
      templateUrl: 'partials/user.deckList.html',
      controller: 'userDeckListCtrl',
      resolve: { deck: ['$stateParams','deckManager', function($stateParams, deckManager) {
        return deckManager.getDeck($stateParams.username, $stateParams.deck);
      }] }
    }); /*
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
    ; */

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

})();
