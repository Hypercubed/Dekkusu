angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$state','$stateParams','deckManager','rootIds','storage',
                      function ($scope,  $rootScope,   $state,  $stateParams,  deckManager,  rootIds, storage) {

    //console.log('storage',storage);

    $scope.username = $stateParams.username || 'guest';
    //$scope.deckId = $state.params.deck || 'root';

    $scope.decks = rootIds;
    //$scope.listView = false;

    storage.bind($scope,'listView',{defaultValue: false});
    storage.bind($scope,'editView',{defaultValue: false});

    $rootScope.state = $state;

}]);

angular.module('mainApp')
  .controller('userDeckListCtrl', ['$scope','$stateParams','deckManager','deck','$firebase','deckFactory',
                          function ($scope, $stateParams,deckManager,deck,$firebase,deckFactory) {

    $scope.deckId = $stateParams.deck || '';
    //console.log($scope.deckId);

    $scope.deck = deck;
    //console.log(deck);
    deck.$bind($scope,'deck');
    //console.log($scope.deckId);


    $scope.children = deck.$children;
    //deck.$children.$bind($scope,'children');

    $scope.newdeck = { name: '' };
    $scope.isOwner = true;

    //console.log($scope.children);

    $scope.save = function(id) {
      var card = $scope.children[id];  // Shouldn't need to do this.
      card.name2 = card.name;

      deck.$children.$save(id);
    }

    $scope.addDeck = function(_deck) {
      _deck.name2 = _deck.name;  // Shouldn't need to do this.

      deck.$children.$add(_deck);
      _deck.name = '';
    }

    $scope.removeDeck = function(id) {
      deck.$children.$remove(id);
    }

}]);

angular.module('mainApp')
  .controller('deckCardCtrl', ['$scope',
                          function ($scope) {

    $scope.editCard = false;
    $scope.clozed = true;



}]);
