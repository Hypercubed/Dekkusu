angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$state','$stateParams','deckManager','rootIds','storage',
                      function ($scope,  $rootScope,   $state,  $stateParams,  deckManager,  rootIds, storage) {

    //console.log('storage',storage);

    $scope.username = $stateParams.username || 'guest';
    //$scope.deckId = $state.params.deck || 'root';

    $scope.decks = rootIds;
    //$scope.listView = false;
    storage.bind($scope,'listView',{defaultValue: false});

    $rootScope.state = $state;

}]);

angular.module('mainApp')
  .controller('userDeckListCtrl', ['$scope','$stateParams','deckManager','deck','$firebase',
                          function ($scope, $stateParams,deckManager,deck,$firebase) {

    $scope.deckId = $stateParams.deck || 'root';
    //console.log($scope.deckId);

    $scope.deck = deck;
    //deck.$bind($scope,'deck');

    $scope.children = deck.$children;
    //deck.$children.$bind($scope,'children');

    console.log($scope.children);

    $scope.newdeck = { name: '' };
    $scope.isOwner = true;

    $scope.addDeck = function(deck) {
      deck.name2 = deck.name;
      $scope.children.$add(deck);
      //deckManager.addDeck($scope.username, $scope.deckId, deck);
      deck.name = '';
    }

    $scope.removeDeck = function(id) {
      $scope.children.$remove(id);
      //deckManager.removeDeck($scope.username, $scope.deckId, id);
    }

}]);

angular.module('mainApp')
  .controller('deckCardCtrl', ['$scope',
                          function ($scope) {

    $scope.editCard = false;
    $scope.clozed = true;

}]);
