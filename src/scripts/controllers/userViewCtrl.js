angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$location', '$http', '$stateParams', '$rootScope', '$firebase', 'FBURL', '$state',
                      function ($scope, $rootScope, $location, $http, $stateParams, $rootScope, $firebase, FBURL,$state) {

    $scope.username = $stateParams.username || 'guest';
    $scope.deckId = $stateParams.deck || null;
    $scope.decks = [];
    $scope.listView = false;

    var ref = new Firebase(FBURL).child('decks/'+$scope.username);
    $scope.decks = $firebase(ref);

    $scope.addDeck = function(cards) {
      var cards = cards || [{text:""}];
      var name = 'Deck', index = 'deck', i = 1;

      while ($scope.decks[index]) {
        i++;
        name = 'Deck '+i;
        index = 'deck-'+i;
      }

      var deck = { id: index, name: name, cards: cards };

      $scope.decks.$add(deck);
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
