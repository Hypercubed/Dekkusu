
angular.module('mainApp')
  .controller('DecksCtrl', ['$scope','$stateParams','deck','children',
                          function ($scope,  $stateParams,  deck, children) {

    $scope.deckId = $stateParams.deck || '';
    //console.log($scope.deckId);

    $scope.deck = deck;

    deck.$bind($scope,'deck');

    $scope.children = children;

    $scope.newdeck = { name: '' };

    $scope.save = function(id) {  // Shouldn't need to do any of this.
      if (id == $scope.deckId) {
        deck.$save();
      } else {
        children.$save(id);
      }
    }

    $scope.addDeck = function(_deck) {
      _deck.name2 = _deck.name;  // Shouldn't need to do this.

      children.$add(_deck);
      _deck.name = '';
    }

    $scope.removeDeck = function(id) {
      children.$remove(id);
    }

    $scope.drop = function(e, ui, item, id) {
      console.log('drop', item, id, children);
    }

    $scope.dropped = [];

}]);

// Move to directive?
angular.module('mainApp')
  .controller('DeckCtrl', ['$scope',
                          function ($scope) {

    $scope.editCard = false;
    $scope.clozed = true;

    //console.log($scope);

    $scope.fontSize = function(text) {
      var c = (text) ? text.length : 0;
      if (c<5) return '60px';
      if (c>80) return '14px';
      return Math.floor(-45/75*text.length+57)+'px';
    }

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

/// Old stuff... refactor

angular.module('mainApp')
  .controller('xxxDeckListCtrl', ['$scope', '$location', '$http', '$stateParams', '$rootScope',
                      function ($scope, $location, $http, $stateParams, $rootScope) {

  console.log($stateParams);

}]);

angular.module('mainApp').directive('xxxfittext', function() {

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

angular.module('mainApp')
  .controller('xxxDeckCtrl2', ['$scope', '$http',
                    function($scope, $http) {

  /* $scope.clearCards = function() {
    $scope.deck.cards = [{text:""}];
  }

  $scope.resetCards = function() {
    $http.get('data/first30.txt')
      .success(function (data, status, headers, config) {
        var cards = data.split('\n')
          .filter(function(t) {
            return t != '';
          })
          .map(function(c) {
            c = c.replace(/\\n/g, '\n');
            var now = Date.now();
            return { text: c, due: now, last: null, interval: 0 }
          });

        $scope.deck.cards = cards;

      });
  } */

  //$scope.$watch('deck', function() {
  //  console.log('$scope.$watch deck');
   // cardStorage.saveDecks($scope.decks);
  //}, true);

}]);


angular.module('mainApp').controller('xxxDeckCtrl', ['$state','$scope', '$location', '$http', '$stateParams', '$rootScope', 'statusFilterFilter', '$firebase', 'FBURL', 'deckManager',
                                         function ($state, $scope, $location,   $http,   $stateParams,   $rootScope,   statusFilter,         $firebase,   FBURL,  deckManager) {

  $scope.username = $stateParams.username || 'default';
  $rootScope.deckId = $scope.deckId = $stateParams.deck || 0;
  $scope.decks = [];
  //$scope.deck = { cards: [] };
  $scope.search = $location.search();

  $scope.filter = STATUSALL;
  $scope.isEditing = false;

  //var ref = new Firebase(FBURL).child('decks');
  //var cardRef = ref.child($stateParams.deck).child('cards');

  $scope.decks = deckManager.getUserDeckIds($scope.username);
  $scope.cards = deckManager.getCardsByDeckId($scope.deckId);

  $scope.cards.$on("loaded", getStats);
  $scope.cards.$on("change", getStats);

  $scope.add = function(card) {
    card.due = new Date()+5*MINS;

    $scope.cards.$add(card);
    card.text = '';
  }

  function getStats() {

    //console.log($scope.cards);

    //$scope.cards = $scope.deck.cards;
    var keys = $scope.cardIds = $scope.cards.$getIndex();
    //console.log(keys);

    $scope.stats = {
      new: 0,
      due: 0,
      done: 0,
      total: keys.length
    };

  }

  /* $scope.copyCards = function() {
    var deck = $scope.deck;
    var user = $scope.user.username;
    var loc = user+'/'+deck.id
    var ref = new Firebase(FBURL).child('decks/'+loc).set(deck);
    $location.path('/'+loc);
  }

  $scope.editDeck = function(b) {
    $scope.isEditing = (arguments.length > 0) ? b : !$scope.isEditing;
  }

  $scope.gotoDeck = function(index) {
    $location.path('/'+$scope.username+'/'+index);
  }

  $scope.resetCards = function() {
    $http.get('data/first30.txt')
      .success(function (data, status, headers, config) {
        var cards = data.split('\n')
          .filter(function(t) {
            return t != '';
          })
          .map(function(c) {
            c = c.replace(/\\n/g, '\n');
            var now = Date.now();
            return { text: c, due: now, last: null, interval: 0 }
          });

        refCards.remove();

        cards.forEach(function(c) {
          $scope.cards.add(c);
        });

        //$scope.cards = cards;
        getCard();

      });
  }

  $scope.clearCards = function() {
    $scope.cards = [{text:""}];
    //getCard();
  }

  //$scope.location = $location;

  function init() {
    $scope.filter = STATUSALL;
    $scope.isEditing = false;
    //$scope.decks = cardStorage.getDecks();
    //$scope.deck = $scope.decks[$scope.deckId];
    getCard();
  }

  function getCard() {
    //$scope.cards = $scope.deck.cards;
    //$scope.index = 0;
    //$scope.goto($scope.index);
    //$scope.applyFilter($scope.filter);
  }

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

  /* $scope.reset = function() {
    console.log('reset');

    $http.get('data/first30.txt')
      .success(function (data, status, headers, config) {
        console.log('data',data);
        $scope.deck.cards = data.split('\n')
          .filter(function(t) {
            return t != '';
          })
          .map(function(c) {
            c = c.replace(/\\n/g, '\n');
            var now = Date.now();
            return { text: c, due: now, last: null, interval: 0 }
          });

        //saveCards($scope.cards);
        //getCard();

      });

  }

  $scope.clear = function() {
    $scope.deck.cards = [];

    //$scope.save();
    //getCard();
  } */

  //$scope.dueNow = function dueNow(c) {
  //  var now = new Date();
  //  return c.due < now;
  //}

  //init();

  //$scope.$watch('filter', function(newVal, oldVal) {
    //console.log('filter changed',newVal, oldVal);
  //  if (newVal == oldVal) return;

  //  $scope.applyFilter(newVal);

  //});

  //$scope.$watchCollection('[card.text,card.due,card.interval,card.last]', function(newVal, oldVal) {
    //console.log('card changed',newVal, oldVal);
    //if (newVal == oldVal) return;

    //console.log($scope.card);

    //$scope.cards.update($scope.card);

  //},true);

}]);




/*angular.module('mainApp').factory('cardStorage', ['$http', function ($http) {
  var STORAGE_ID = 'cards-app';

  var exports = {};

  exports.getDecks = function() {
    var json = localStorage.getItem(STORAGE_ID+'-decks');

    if (json) {
      return JSON.parse(json);
    } else {
      return [ { name: 'Default', cards: [] } ];
    }
  }

  exports.saveDecks = function(decks) {
    localStorage.setItem(STORAGE_ID+'-decks', JSON.stringify(decks));
  }

  exports.getCard = function(id) {
    var id = id || 0;

    var decks = exports.getDecks();
    return decks[id].cards || [];

    //var json = localStorage.getItem(STORAGE_ID+'-cards'+id);

   // if (json) {
    //  var cards = JSON.parse(json);
    //  return cards;
    //} else {
    //  return [];
    //}

  }

  exports.saveCards = function(id, cards) {
    var id = id || 0;

    var decks = exports.getDecks();
    decks.cards = cards;
    exports.saveDecks(decks);

    //localStorage.setItem(STORAGE_ID+'-cards'+id, JSON.stringify(cards));
  }

  return exports;

}]);*/
