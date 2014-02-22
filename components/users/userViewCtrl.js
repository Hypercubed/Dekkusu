
angular.module('mainApp')

  // This should be a set controller
  .controller('userViewCtrl', ['$scope','$rootScope', '$state','$stateParams','rootDeck','user', 'storage',
                      function ($scope,  $rootScope,   $state,  $stateParams,  rootDeck,  user,   storage) {

    $scope.user = user;
    $scope.username = $stateParams.username || 'guest';  // Do I still need this?

    $scope.rootDeck = rootDeck;
    $scope.decks = rootDeck.$children;
    //console.log(rootDeck);

    storage.bind($scope,'listView',{defaultValue: false});
    storage.bind($scope,'editView',{defaultValue: false});

    $rootScope.state = $state;  // TODO: do I need this?

    $scope.$watch('auth.user', function(authUser) {  // Do this better
      if (!authUser) return $scope.isOwner = false;
      $scope.isOwner = (authUser.username == user.$id || authUser.id == user.$id);
    });

}]);

angular.module('mainApp')

  // This should be setDeckListCtrl
  .controller('userDeckListCtrl', ['$scope','$stateParams','deck',
                          function ($scope,  $stateParams,  deck) {

    $scope.deckId = $stateParams.deck || '';
    //console.log($scope.deckId);

    $scope.deck = deck;
    //console.log(deck);

    deck.$bind($scope,'deck');
    //console.log($scope.deckId);


    $scope.children = deck.$children;  // TODO: get from resolve
    //deck.$children.$bind($scope,'children');

    $scope.newdeck = { name: '' };

    //console.log($scope.children);

    $scope.save = function(id) {  // Shouldn't need to do any of this.
      if (id == $scope.deckId) {
        deck.$save();
      } else {
        deck.$children.$save(id);
      }
    }

    $scope.addDeck = function(_deck) {
      _deck.name2 = _deck.name;  // Shouldn't need to do this.

      deck.$children.$add(_deck);
      _deck.name = '';
    }

    $scope.removeDeck = function(id) {
      deck.$children.$remove(id);
    }

    $scope.drop = function(e, ui, item, id) {
      console.log('drop', item, id, $scope.children);
    }

    $scope.dropped = [];

}]);

// Move to directive?
angular.module('mainApp')
  .controller('deckCardCtrl', ['$scope',
                          function ($scope) {

    $scope.editCard = false;
    $scope.clozed = true;

    //console.log($scope);

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
