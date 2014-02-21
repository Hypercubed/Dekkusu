
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

    // Resolves
    var userAuth = ['userManager', function(userManager) {
          return userManager.auth();
        } ];

    var users = ['userManager', function(userManager) {
          return userManager.getUsers();
        } ];

    var user = ['$stateParams','userManager', function($stateParams, userManager) {
                    return userManager.getUserData($stateParams.username);
                   } ];

    var rootDeck = ['$stateParams','deckManager', function($stateParams, deckManager) {
                      return deckManager.getDeck($stateParams.username);
                    }];

    var deck = ['$stateParams','deckManager', function($stateParams, deckManager) {
          return deckManager.getDeck($stateParams.username, $stateParams.deck);
        }];

    $stateProvider
      .state("authroot", {
        abstract: true,
        controller: 'HomeCtrl',
        resolve: {  userAuth: userAuth },
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
        url: "/users",
        controller: 'ListCtrl',
        templateUrl: 'components/users/listView.html',
        resolve: {  users: users }
      })
      .state('authroot.user', {
        abstract: true,
        url: "/:username",
        templateUrl: 'components/users/userView.html',
        controller: 'userViewCtrl',
        resolve: { rootDeck: rootDeck, user: user }
      })
      .state('authroot.user.deckList', {
        url: '',
        templateUrl: 'components/decks/deckList.html',
        controller: 'userDeckListCtrl',
        resolve: { deck: rootDeck }
      })
      .state('authroot.user.deck', {
        url: "/:deck",
        templateUrl: 'components/decks/deckList.html',
        controller: 'userDeckListCtrl',
        resolve: { deck: deck }
      });

    }]);

  angular.module('mainApp')
    .controller('AppCtrl', ['$rootScope',
                    function ($rootScope) {

    $rootScope.$on('$stateChangeError',
      function() {
        console.log('$stateChangeError');
      });

    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams){
        console.log('$stateNotFound');
        console.log(unfoundState.to);
        console.log(unfoundState.toParams);
        console.log(unfoundState.options);
      });

  }]);

  angular.module('mainApp').run(['$rootScope', 'SITE',function($rootScope, SITE) {
    $rootScope.site = SITE;
  }]);


})();
