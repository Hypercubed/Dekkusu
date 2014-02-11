angular.module('mainApp')
  .controller('userViewCtrl', ['$scope','$rootScope', '$state','$stateParams','deckManager','rootIds','storage',
                      function ($scope,  $rootScope,   $state,  $stateParams,  deckManager,  rootIds, storage) {

    console.log('$stateParams',$stateParams);

    $scope.username = $stateParams.username || 'guest';
    //$scope.deckId = $state.params.deck || 'root';

    $scope.decks = rootIds;
    //$scope.listView = false;

    //console.log(rootIds);

    /* $scope.decks.$set('_temp', function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log('success');
      }
    }); */

    storage.bind($scope,'listView',{defaultValue: false});
    storage.bind($scope,'editView',{defaultValue: false});

    $rootScope.state = $state;
    //console.log($rootScope.auth.user.username);

    if (!$rootScope.auth.user) {  // Need a better way
      $scope.isOwner = false;
    } else {
      $scope.isOwner = ($rootScope.auth.user.username == $stateParams.username || $rootScope.auth.user.id == $stateParams.username);
    }

}]);

angular.module('mainApp')
  .controller('userDeckListCtrl', ['$scope','$rootScope','$stateParams','deckManager','deck','$firebase','deckFactory',
                          function ($scope, $rootScope, $stateParams,deckManager,deck,$firebase,deckFactory) {

    $scope.deckId = $stateParams.deck || '';
    //console.log($scope.deckId);

    $scope.deck = deck;
    //console.log(deck);

    deck.$bind($scope,'deck');
    //console.log($scope.deckId);


    $scope.children = deck.$children;
    //deck.$children.$bind($scope,'children');

    $scope.newdeck = { name: '' };

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

    $scope.isClozed = function(text) {
      if (!text || text.length == 0) return false;
      return text.indexOf("{") > -1;
    }

    $scope.edit = function(id) {
      $scope.editCard = !$scope.editCard;
      if (!$scope.editCard) {
        $scope.save(id);
      }
    }

}]);

angular.module('mainApp').directive('fittext', function() {

  return {
    scope: {
      minFontSize: '@',
      maxFontSize: '@',
      text: '='
    },
    restrict: 'C',
    transclude: true,
    template: '<div ng-transclude class="textContainer" ng-bind-html="text" style="border: 1px solid red; display: inline-block;"></div>',
    controller: function($scope, $element, $attrs) {
      var fontSize = $scope.maxFontSize || 50;
      var minFontSize = $scope.minFontSize || 14;

      // text container
      var textContainer = $element[0].querySelector('.textContainer');

      // max dimensions for text container
      var maxHeight = $element[0].offsetHeight;
      var maxWidth = $element[0].offsetWidth;

      var textContainerHeight;
      var textContainerWidth;

      var resizeText = function(){
        do {
          // set new font size and determine resulting dimensions
          textContainer.style.fontSize = fontSize + 'px';
          textContainerHeight = textContainer.offsetHeight;
          textContainerWidth = textContainer.offsetWidth;

          console.log(textContainerWidth);

          // shrink font size
          var ratioHeight = Math.floor(textContainerHeight / maxHeight);
          var ratioWidth = Math.floor(textContainerWidth / maxWidth);
          var shrinkFactor = 1;
          fontSize -= shrinkFactor;

        } while ((textContainerWidth > maxWidth) && fontSize > minFontSize);
      };

      // watch for changes to text
      $scope.$watch('text', function(newText, oldText){
        if(newText === undefined) return;

        // text was deleted
        if(oldText !== undefined && newText.length < oldText.length){
          fontSize = $scope.maxFontSize;
        }
        resizeText();
      });
    }
  };
});
