
(function() {

  angular.module('mainApp')
    .config([
      '$stateProvider',
      '$urlRouterProvider',

    function($stateProvider, $urlRouterProvider) {

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
        controller: 'HomeCtrl',
        resolve: {  userAuth: ['userManager', function(userManager) {
          return userManager.auth;
        } ] },
        templateUrl: 'components/home/rootView.html'
      })
      .state('authroot.home', {
        url: "/",
        templateUrl: 'components/home/homeView.html',
      })
      .state('authroot.readme', {
        url: "/readme",
        templateUrl: 'components/home/README.html',
      })
      .state('authroot.list', {
        url: "/list",
        controller: 'ListCtrl',
        templateUrl: 'components/list/listView.html'
      })
      .state('authroot.user', {  // Rename to set?
        abstract: true,
        url: "/:username",  // TODO: username -> path?
        templateUrl: 'components/decks/userView.html',
        controller: 'userViewCtrl',
        resolve: { rootDeck: ['$stateParams','deckManager', function($stateParams, deckManager) {
                      return deckManager.getDeck($stateParams.username);
                    }]
        }
      })
      .state('authroot.user.deckList', {
        url: '',
        templateUrl: 'components/decks/user.deckList.html',
        controller: 'userDeckListCtrl',
        resolve: { deck: ['rootDeck', function(rootDeck) {
          return rootDeck;
        }] }
      })
      .state('authroot.user.deck', {
        url: "/:deck",
        templateUrl: 'components/decks/user.deckList.html',
        controller: 'userDeckListCtrl',
        resolve: { deck: ['$stateParams','deckManager', function($stateParams, deckManager) {
          return deckManager.getDeck($stateParams.username, $stateParams.deck);
        }] }
      });

    }]);

  angular.module('mainApp').run(['$rootScope', 'SITE',function($rootScope, SITE) {
    $rootScope.site = SITE;
  }]);


})();
