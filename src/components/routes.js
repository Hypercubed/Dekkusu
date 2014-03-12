
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
                    return userManager.getUser($stateParams.username);
                   } ];

    var rootDeck = ['$stateParams','deckManager', function($stateParams, deckManager) {
                      return deckManager.getDeck($stateParams.username);
                    }];

    var deck = ['$stateParams','deckManager', function($stateParams, deckManager) {
          return deckManager.getDeck($stateParams.username, $stateParams.deck);
        }];

    var rootChildren = ['$stateParams','deckManager', function($stateParams, deckManager) {
          return deckManager.getChildren($stateParams.username);
        }];

    var children = ['$stateParams','deckManager', function($stateParams, deckManager) {
          return deckManager.getChildren($stateParams.username, $stateParams.deck);
        }];

    $stateProvider
      .state("authroot", {
        abstract: true,
        controller: 'HomeCtrl',
        resolve: {  userAuth: userAuth },
        templateUrl: 'components/home/root.html'
      })
      .state('authroot.home', {
        url: '/',
        templateUrl: 'components/home/home.html',
      })
      .state('authroot.readme', {
        url: "/readme",
        templateUrl: 'components/home/README.html',
      })
      .state('authroot.users', {
        url: "/users",
        controller: 'UsersCtrl',
        templateUrl: 'components/users/users.html',
        resolve: {  users: users }
      })
      .state('authroot.username', {  // TODO: Handle user not found
        abstract: true,
        url: "/:username",
        templateUrl: 'components/users/user.html',
        controller: 'UserCtrl',
        resolve: { rootDeck: rootDeck, user: user, children: rootChildren }
      })
      .state('authroot.username.root', {
        url: '',
        templateUrl: 'components/decks/decks.html',
        controller: 'DecksCtrl',
        resolve: { deck: rootDeck, children: rootChildren }
      })
      .state('authroot.username.deck', {  // TODO: Handle deck not found
        url: "/:deck",
        templateUrl: 'components/decks/decks.html',
        controller: 'DecksCtrl',
        resolve: { deck: deck, children: children }
      })
      .state('authroot.username.tree', {  // TODO: Handle deck not found
        url: "/:deck/tree",
        templateUrl: 'components/decks/deckTree.html',
        controller: 'DecksCtrl',
        resolve: { deck: deck, children: children }
      })
      .state('authroot.username.export', {  // TODO: Handle deck not found
        url: "/:deck/export",
        templateUrl: 'components/decks/deckExport.html',
        controller: 'DecksCtrl',
        resolve: { deck: deck, children: children }
      })
      ;

    }]);

  angular.module('mainApp').run(['$rootScope', 'SITE','growl', '$log', function($rootScope, SITE,growl,$log) {
    $rootScope.site = SITE;

    $rootScope.$on('$stateChangeError',
      function() {
        growl.addErrorMessage('State change error');
        $log.error(arguments);
      });

    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams){
        growl.addSuccessMessage('State not found error');
        $log.error(arguments);
      });

  }]);


})();
