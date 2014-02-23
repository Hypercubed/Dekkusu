
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
        templateUrl: 'components/home/root.html'
      })
      .state('authroot.home', {
        url: "/",
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
        resolve: { rootDeck: rootDeck, user: user }
      })
      .state('authroot.username.root', {
        url: '',
        templateUrl: 'components/decks/decks.html',
        controller: 'DecksCtrl',
        resolve: { deck: rootDeck }
      })
      .state('authroot.username.deck', {  // TODO: Handle deck not found
        url: "/:deck",
        templateUrl: 'components/decks/decks.html',
        controller: 'DecksCtrl',
        resolve: { deck: deck }
      });

    }]);

  angular.module('mainApp').run(['$rootScope', 'SITE','growl', '$log', function($rootScope, SITE,growl) {
    $rootScope.site = SITE;

    $rootScope.$on('$stateChangeError',
      function() {
        growl.addErrorMessage('State change error');
      });

    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams){
        growl.addSuccessMessage('State not found error');
        $log.error(unfoundState, fromState, fromParams);
      });

  }]);


})();
