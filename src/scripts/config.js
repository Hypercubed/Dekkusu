
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
    .state('user', {  // Rename to set?
      abstract: true,
      url: "/:username",  // TODO: username -> path?
      templateUrl: 'partials/userView.html',
      controller: 'userViewCtrl',
      resolve: { rootIds: ['$stateParams','deckManager', function($stateParams, deckManager) {
        return deckManager.getDeckIds($stateParams.username);
      }] }
    })
    .state('user.deckList', {
      url: '',
      templateUrl: 'partials/user.deckList.html',
      controller: 'userDeckListCtrl',
      resolve: { deckIds: ['$stateParams','deckManager', function($stateParams, deckManager) {
        return deckManager.getDeckIds($stateParams.username);
      }] }
    })
    .state('user.deck', {
      url: "/:deck",
      templateUrl: 'partials/user.deckList.html',
      controller: 'userDeckListCtrl',
      resolve: { deckIds: ['$stateParams','deckManager', function($stateParams, deckManager) {
        return deckManager.getDeckIds($stateParams.username, $stateParams.deck);
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

  app.run(['$firebase','$firebaseAuth', 'FBURL', '$rootScope','deckManager',
    function($firebase, $firebaseAuth, FBURL, $rootScope,deckManager) {

      var ref = new Firebase(FBURL);
      $rootScope.auth = $firebaseAuth(ref);

      $rootScope.$on("$firebaseAuth:login", function(evt, user) {
        //$rootScope.userRootSet = deckManager.getSet(user.username);
      });

      $rootScope.$on("$firebaseAuth:logout", function(evt) {
        //$rootScope.userRootSet = null;
      });

      $rootScope.$on("$firebaseAuth:error", function(evt, err) {
        console.log(err);
      });

    }]);

  app.run(['$rootScope','SITE', function($rootScope,SITE) {
    $rootScope.site = SITE;
  }]);

})();
