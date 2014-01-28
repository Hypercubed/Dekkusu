angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$state','$stateParams','deckManager','rootIds',
                      function ($scope,  $rootScope,   $state,  $stateParams,  deckManager,  rootIds) {

    $scope.username = $stateParams.username || 'guest';
    //$scope.deckId = $state.params.deck || 'root';

    $scope.decks = rootIds;
    $scope.listView = false;

    $rootScope.state = $state;

}]);

angular.module('mainApp')
  .controller('userDeckListCtrl', ['$scope','$stateParams','deckManager','deckIds',
                          function ($scope, $stateParams,deckManager,deckIds) {

    $scope.deckId = $stateParams.deck || 'root';
    $scope.decks = deckIds;

    $scope.newdeck = { name: '' };
    $scope.isOwner = true;

    $scope.addDeck = function(deck) {
      deckManager.addDeck($scope.username, $scope.deckId, deck);
      deck.name = '';
    }

    $scope.removeDeck = function(id) {
      deckManager.removeDeck($scope.username, $scope.deckId, id);
    }

}]);

angular.module('mainApp')
  .controller('deckCardCtrl', ['$scope',
                          function ($scope) {

    $scope.editCard = false;
    $scope.clozed = true;

}]);
