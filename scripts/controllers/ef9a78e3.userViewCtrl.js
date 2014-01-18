angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$location', '$http', '$stateParams', '$rootScope', '$firebase', 'FBURL', '$state','deckManager',
                      function ($scope, $rootScope, $location, $http, $stateParams, $rootScope, $firebase, FBURL,$state,deckManager) {

    $scope.username = $stateParams.username || 'guest';
    $scope.deckId = $state.params.deck || null;
    $scope.decks = [];
    $scope.listView = false;

    $rootScope.$on('$stateChangeSuccess', function(){
      $scope.deckId = $state.params.deck || null;
    })

    $scope.decks = deckManager.getUserDeckIds($scope.username);

    $scope.addDeck = function() {
      deckManager.addDeck($scope.username);
    }

    $scope.removeDeck = function(id) {
      deckManager.removeDeck($scope.username, id);
    }

    function slugify(input) {  // Todo: filter
      return input
        .replace('/', '-')
        .replace(' ', '-')
        .replace('#', '-')
        .replace('?', '-');
    }

    setAuth();

    function setAuth() {
      $scope.isOwner = ($rootScope.auth.user) ? $rootScope.auth.user.username == $scope.username : $scope.username == 'guest';
      console.log('setAuth', $scope.isOwner, $rootScope.auth.user, $rootScope.username);
    }

    $rootScope.$on("$firebaseAuth:login", function(e, user) {
      console.log("User " + user.id + " successfully logged in!");
      setAuth();
    });

    $scope.$on("$firebaseAuth:logout", function(evt) {
      setAuth()
    });

    $scope.$on("$firebaseAuth:error", function(evt, err) {
      setAuth()
    });

}]);
