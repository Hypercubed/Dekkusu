'use strict';

var DEBUG = false;

var SECONDS = 1000;
var MINS = 60*SECONDS;
var HOURS = 60*MINS;
var DAYS = 24*HOURS;  // 1 day in milliseconds

angular.module('mainApp')
  .controller('DeckListCtrl', ['$scope', '$location', '$http', '$stateParams', '$rootScope',
                      function ($scope, $location, $http, $stateParams, $rootScope) {

  console.log($stateParams);

}]);

angular.module('mainApp')
  .controller('DeckCtrl2', ['$scope', '$http',
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


angular.module('mainApp').controller('DeckCtrl', ['$state','$scope', '$location', '$http', '$stateParams', '$rootScope', 'statusFilterFilter', '$firebase', 'FBURL', 'deckManager',
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

angular.module('mainApp').filter('formatCard', ['$sanitize', function ($sanitize) {

  var furigana = function(converter) {
    return [
      { type: 'lang', regex: '(\\S*)\\{\\[(.*?)\\]\\}', replace: '$1[{$2}]' },
      { type: 'lang', regex: '(\\S*)\\[(.*?)\\]', replace: '<ruby><rb>$1</rb><rp>&#91;</rp><rt>$2</rt><rp>&#93;</rp></ruby>' }
    ];
  }

  var cloze = function(converter) {
    return [
      { type: 'lang', regex: '{{(.*?)::(.*?)}}', replace: '&#91;{$1}<span class="uncloze">$2</span>&#93;' },
      { type: 'lang', regex: '{(.*?)::(.*?)}', replace: '{$1}<span class="uncloze">$2</span>' },
      { type: 'lang', regex: '{{(.*?)}}', replace: '&#91;{$1}<span class="uncloze">...</span>&#93;' },
      { type: 'lang', regex: '{(.*?)}', replace: '<span class="cloze">$1</span>' }
    ];
  }

  var extra = function(converter) {
    return [
      { type: 'lang', regex: '\n{1,}', replace: '\n\n' }//,
      //{ type: 'lang', regex: '\\{', replace: '~E123E' },
      //{ type: 'lang', regex: '\\}', replace: '~E125E' },
      //{ type: 'lang', regex: '\\[', replace: '~E91E' },
      //{ type: 'lang', regex: '\\]', replace: '~E93E' }
    ];
  }

  var showdown = new Showdown.converter({ extensions: [
      extra,
      furigana,
      cloze
    ]
  });

  return function getFormattedCard(input) {
    //var md = cloze(input);
    //return $sce.trustAsHtml(showdown.makeHtml(input || ''));
    return $sanitize(showdown.makeHtml(input || ''));  // Check sanitization
  }

}]);

angular.module('mainApp').filter('firstDueIndex', function() {

  return function(input) {
    var out = undefined;

    if (input) {
      for (var i in input)
        if (out == undefined || input[i].due < input[out].due)
          out = i;
    }
    return +out;
  }

});

angular.module('mainApp').filter('dueNow', function() {

  return function dueNow(input) {
    var now = Date.now();
    return input.filter(function(d) {
      return d.due < now;
    });
  }

});

angular.module('mainApp').filter('dateDays', function() {
  var now = Date.now();
  return function dueNow(input) {
    if (!input) return 'now';

    var delta = input - now;  // milli
    if (delta < 0 || !delta) return 'now';
    delta = delta/1000/60;  // min
    if (delta < 1) return 'soon';
    delta = delta/60/24;       // day
    if (delta < 1) return 'today';
    return Math.floor(delta) + ' days';
  }

});

angular.module('mainApp').filter('markdown', [function () {
    var converter = new Showdown.converter();
    return function (value) {
        //return $sce.trustAsHtml(converter.makeHtml(value || ''));
        return converter.makeHtml(value || '');
    };
}]);

// TODO: Don't do this
var STATUSALL = -1;
var STATUSNEW = 0;
var STATUSDUE = 1;
var STATUSDONE = 2;

angular.module('mainApp').filter('status', [function () {
    var now = Date.now();
    return function (card) {
      if (!card) return -1;

      if (card.last == null)
        return STATUSNEW;
      if (card.due <= now)
        return STATUSDUE;
      return STATUSDONE;

    };
}]);

angular.module('mainApp').filter('statusText', [function () {

    return function (value) {

      if (value == STATUSNEW)
        return "New";
      if (value == STATUSDUE)
        return "Due";
      return "Not due";

    };
}]);

angular.module('mainApp').filter("statusFilter", ['$filter', function($filter){
  var statusCode = $filter('status');

  return function(input, code){

    if (code == -1)
      return input;

    return input.filter(function(d) {
      return statusCode(d) == code;
    });
  }

}]);

  // function applyFilter(filter) {
  //   $scope.filter = filter = filter || $scope.filter;

  //   var now = Date.now();

  //   $scope.filteredCards = $scope.cards.filter(function(d) {
  //     if (filter == 'all')
  //       return true;
  //     if (filter == 'due')
  //       return (d.due - d.last) <= 0;
  //     if (filter == 'pending')
  //       return (d.due - d.last) > 0;
  //     return true;
  //   }).sort(function(a,b) {
  //     return a.due<b.due?-1:a.due>b.due?1:0;
  //   });

  //   $scope.goto($scope.index);
  // }


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



