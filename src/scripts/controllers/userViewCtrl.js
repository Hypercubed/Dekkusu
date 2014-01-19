angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$location', '$http', '$stateParams', '$rootScope', '$firebase', 'FBURL', '$state','deckManager',
                      function ($scope, $rootScope, $location, $http, $stateParams, $rootScope, $firebase, FBURL,$state,deckManager) {

    $scope.username = $stateParams.username || 'guest';
    $scope.deckId = $state.params.deck || null;
    $scope.decks = deckManager.getUserDeckIds($scope.username);

    $scope.listView = false;
    $scope.newdeck = { name: '', owner: $scope.username };

    $scope.isOwner = true;  // Fix this.

    $rootScope.state = $state;

    loadDeck();

    function loadDeck() {
      $scope.deckId = $state.params.deck || null;

      if ($scope.deckId) {
        $scope.deck = deckManager.getDeckById($scope.deckId);
        console.log($scope.deck.cards);
      } else {
        $scope.deck = null;
      }
    }

    $rootScope.$on('$stateChangeSuccess', loadDeck);

    $scope.addDeck = function(deck) {
      deckManager.addDeck($scope.username, deck);
      deck.name = '';
    }

    $scope.removeDeck = function(id) {
      deckManager.removeDeck($scope.username, id);
    }

}]);
