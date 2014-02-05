angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$state','$stateParams','deckManager','rootIds','userStorage',
                      function ($scope,  $rootScope,   $state,  $stateParams,  deckManager,  rootIds, userStorage) {

    $scope.username = $stateParams.username || 'guest';
    //$scope.deckId = $state.params.deck || 'root';

    $scope.decks = rootIds;
    $scope.listView = false;;

    $rootScope.state = $state;

}]);

angular.module('mainApp')
  .controller('userDeckListCtrl', ['$scope','$stateParams','deckManager','deck',
                          function ($scope, $stateParams,deckManager,deck) {

    $scope.deckId = $stateParams.deck || 'root';
    //console.log($scope.deckId);

    $scope.deck = deck;

    //$scope.decks = deckIds;
    //deckIds.$bind($scope, "decks");
    //console.log(deckIds);

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
