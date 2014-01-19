angular.module('mainApp').controller('cardViewCtrl', ['$scope', '$location', '$http', '$stateParams', '$rootScope', 'statusFilterFilter',
                                             function ($scope,   $location,   $http,   $stateParams,   $rootScope,   statusFilter) {

  //$scope.cardIds = $scope.$parent.cards.$getIndex();
  $scope.index = 0;

  $scope.$watch('index', function(index) {
    if (index >= $scope.$parent.cardIds.length)
      index = 0;

    if (index < 0)
      index = $scope.$parent.cardIds.length-1;

    $scope.index = index;
  });

  $scope.keypressCallback = function($event) {
    console.log($event.keyCode);

    if ($event.keyCode == 32) {          // space
      $scope.flip();
      $event.preventDefault();
    } else if ($event.keyCode == 13) {   // enter
      $scope.edit();
    } else if ($event.keyCode == 37) {   // left
      $scope.prev();
    } else if ($event.keyCode == 39) {   // right
      $scope.next();
    } else if ($event.keyCode == 38 && !$scope.clozed) {   // up
      $scope.up();
    } else if ($event.keyCode == 40 && !$scope.clozed) {   // down
      $scope.down();
    }
  }

  $scope.prev = function() {
    $scope.index--;
  }

  $scope.next = function() {
    $scope.index++;
  }

  /* $scope.add = function() {

    var text = getSelectedText();

    var card = {};
    card.text = text || '';
    card.due = card.due || Date.now();
    card.interval = card.interval || 0;

    $scope.cards.add(card);
    //$scope.filteredCards = $scope.deck.cards;   // TODO: filter

    $scope.goto(card);
    $scope.isEditing = true;
  }

  $scope.deleteCard = function() {
    var index = $scope.deck.cards.indexOf($scope.card);
    $scope.deck.cards.splice(index,1);
    $scope.goto($scope.index);
  }

  var el = angular.element(".cardEditor")[0];

  function getSelectedText() {
    var ws = window.getSelection();

    if (ws.type == 'Range') {
      DEBUG && console.log('Window selection');

      return ws.toString().trim();
    } else if (ws.type == 'None') {
      DEBUG && console.log('Input selection');

      var start = el.selectionStart;
      var end = el.selectionEnd;

      if (start !== end)
        return el.value.slice(start, end).trim();
    }

    return null;
  } */

}]);
