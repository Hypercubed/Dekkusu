angular.module('mainApp').controller('cardViewCtrl', ['$scope', '$location', '$http', '$stateParams', '$rootScope', 'statusFilterFilter',
                                             function ($scope,   $location,   $http,   $stateParams,   $rootScope,   statusFilter) {

  $scope.index = 0;

  console.log($scope.cards);

  $scope.goto = function(index) {
    if (typeof index == 'object')
      index = $scope.cards.indexOf(index);

    if (index > $scope.cards.length)
      index = $scope.cards.length;

    if (index < 0)
      $scope.index = 0;

    $scope.index = index;
    //$scope.card = $scope.cards[$scope.index];

  }

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
    var index = ($scope.index > 0) ? $scope.index : $scope.cards.length;
    $scope.goto(index-1);
  }

  $scope.next = function() {
    var index = ($scope.index < $scope.cards.length-1) ? $scope.index+1 : 0;
    $scope.goto(index);
  }

  $scope.add = function() {

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
  }

}]);
