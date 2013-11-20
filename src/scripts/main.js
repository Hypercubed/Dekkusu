'use strict';

var DEBUG = false;
var DAYS = 1*1000*60*60*24  // 1 day in milliseconds

// Declare app level module which depends on filters, and services
var app = angular.module('mainApp', ['ngRoute','ui.bootstrap', 'ui.keypress', 'ui.event', 'ngSanitize']);

angular.module('mainApp').config(['$routeProvider', function($routeProvider) {
  //console.log('config');

  // TODO: #/:username -> deck list
  //       #/:username/:deckid -> deck

  $routeProvider.
    when('/', {
      templateUrl: 'partials/deckListView.html',
      controller: 'DeckListCtrl'
    }).
    when('/:deckId', {
      templateUrl: 'partials/deckView.html',
      controller: 'DeckCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

}]);

angular.module('mainApp').controller('DeckListCtrl', ['$scope', 'cardStorage', '$location', '$http', '$routeParams', '$rootScope',
  function ($scope, cardStorage, $location, $http, $routeParams, $rootScope) {

  var decks = $scope.decks = cardStorage.getDecks();

  $scope.listView = false;

  $scope.addDeck = function() {
    var name = 'Deck', i = 1;

    while (decks.some(function(d) { return d.name == name; })) {
      i++;
      name = 'Deck '+i;
    }

    decks.push({ name: name, cards: [] });
  }

  $scope.removeDeck = function(index) {  // Move?

    if (index > -1) {
      $scope.decks.splice(index, 1);
    };

  }

  $scope.$watch('decks', function() {
    console.log('$scope.$watch decks');
    cardStorage.saveDecks(decks);
  });

}]);

angular.module('mainApp').controller('DeckCtrl2', ['$scope', '$http', 'cardStorage', function($scope, $http, cardStorage) {

  $scope.clearCards = function() {
    $scope.deck.cards = [];
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
  }

  $scope.$watch('deck', function() {
    console.log('$scope.$watch deck');
    cardStorage.saveDecks($scope.decks);
  }, true);

}]);


angular.module('mainApp').controller('DeckCtrl', ['$scope', 'cardStorage', '$location', '$http', '$routeParams', '$rootScope', 'statusFilterFilter',

  function ($scope, cardStorage, $location, $http, $routeParams, $rootScope, statusFilter) {
  //console.log($routeParams);

  // TODO: find by id
  $scope.deckId = $routeParams.deckId || 0;

  $scope.editDeck = function(b) {
    $scope.isEditing = (arguments.length > 0) ? b : !$scope.isEditing;
  }

  $scope.gotoDeck = function(index) {
    $location.path('/'+index);
  }

  function saveCards(cards) {
    cardStorage.saveCards($scope.deckId, cards);
  }

  $scope.save = function save() {
    cardStorage.saveCards($scope.deckId, $scope.cards);
  };

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
        getCards();

      });
  }

  $scope.clearCards = function() {
    $scope.deck.cards = [];
    getCards();
  }

  //$scope.location = $location;
  $scope.search = $location.search();

  function init() {
    $scope.filter = STATUSDUE;
    $scope.isEditing = false;
    $scope.decks = cardStorage.getDecks();
    $scope.deck = $scope.decks[$scope.deckId];
    getCards();
  }

  function getCards() {
    $scope.cards = $scope.deck.cards;
    $scope.index = 0;
    $scope.applyFilter($scope.filter);
  }

  $scope.applyFilter = function applyFilter(filter) {

    $scope.filter = filter = filter || $scope.filter;

    $scope.filteredCards = statusFilter($scope.cards, $scope.filter)
      .sort(function(a,b) {
        return a.due<b.due?-1:a.due>b.due?1:0;
      });

    $scope.goto($scope.index);
  }

  $scope.goto = function(index) {
    if (typeof index == 'object')
      index = $scope.filteredCards.indexOf(index);

    if (index > $scope.filteredCards.length)
      index = $scope.filteredCards.length;

    if (index < 0)
      $scope.index = 0;

    $scope.index = index;
    $scope.card = $scope.filteredCards[$scope.index];
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
    var index = ($scope.index > 0) ? $scope.index : $scope.filteredCards.length;
    $scope.goto(index-1);
  }

  $scope.next = function() {
    var index = ($scope.index < $scope.filteredCards.length-1) ? $scope.index+1 : 0;
    $scope.goto(index);
  }

  $scope.add = function() {

    var text = ''; //getSelectedText();

    var card = {};
    card.text = text || '';
    card.due = card.due || Date.now();
    card.interval = card.interval || 0;

    $scope.cards.push(card);
    $scope.filteredCards = $scope.cards;   // TODO: filter

    $scope.goto(card);
    $scope.isEditing = true;
  }

  $scope.deleteCard = function() {
    var index = $scope.cards.indexOf($scope.card);
    $scope.cards.splice(index,1);
    $scope.goto($scope.index);
  }

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
        //getCards();

      });

  }

  $scope.clear = function() {
    $scope.deck.cards = [];

    //$scope.save();
    //getCards();
  } */

  //$scope.dueNow = function dueNow(c) {
  //  var now = new Date();
  //  return c.due < now;
  //}

  init();

  $scope.$watch('filter', function(newVal, oldVal) {
    //console.log('filter changed',newVal, oldVal);
    if (newVal == oldVal) return;

    $scope.applyFilter(newVal);

  });

  $scope.$watch('deck', function(newVal) {
    console.log( '$scope.$watch deck', newVal);
    cardStorage.saveDecks($scope.decks);
  }, true);

}]);

angular.module('mainApp').controller('CardCtrl', ['$scope', 'cardStorage', function ($scope, cardStorage) {

  var el = angular.element(".cardEditor")[0];

  function init() {
    $scope.isEditing = false;  // TODO: replace with $scope.editedCard;
    $scope.clozed = true;
  }

  init();

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

  $scope.wrap = function wrap(left, right) {
    var ws = window.getSelection();

    var start = el.selectionStart;
    var end = el.selectionEnd;

    var val = $scope.card.text;
    $scope.card.text = val.slice(0,start) + left + val.slice(start,end) + right + val.slice(end);

    setTimeout(function() {
      el.selectionStart = start+left.length;
      el.selectionEnd = end+left.length;
    }, 100);
  }

  $scope.edit = function(flag) {
    if (arguments.length < 1) flag = !$scope.isEditing;
    $scope.isEditing = flag;
  }

  $scope.flip = function() {
    $scope.clozed = !$scope.clozed;
  }

  $scope.up = function() {
    // Cheap algroithim
    //    n = 1   when n = 0  (view one day later)
    //    n = 2*n otherwise   (view 2*n days later)

    $scope.card.last = Date.now();

    if (($scope.card.due - $scope.card.last) <= 0)                                        // if card is due
      $scope.card.interval = ($scope.card.interval > 0) ? $scope.card.interval*2 : 1;     // Increase interval

    $scope.card.due = $scope.card.last+$scope.card.interval*DAYS;

    $scope.clozed = true;
    $scope.applyFilter();
  }

  $scope.down = function() {
    $scope.card.due = $scope.card.last = Date.now()-5;
    $scope.card.interval = 0;

    $scope.clozed = true;
    $scope.applyFilter();
  }

  $scope.$watch('card.text', function(newVal, oldVal) {
    //console.log('card.text changed',newVal, oldVal);

    if (newVal == oldVal) return;

    //$scope.save();
  });

  $scope.$watch('card.due', function(newVal, oldVal) {
    //console.log('card.due changed',newVal, oldVal);
    if (newVal == oldVal) return;

    //$scope.save();
  });

}]);

app.filter('formatCard', ['$sanitize', function ($sanitize) {

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

app.filter('firstDueIndex', function() {

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

app.filter('dueNow', function() {

  return function dueNow(input) {
    var now = Date.now();
    return input.filter(function(d) {
      return d.due < now;
    });
  }

});

app.filter('dateDays', function() {
  var now = Date.now();
  return function dueNow(input) {
    if (!input) return '-';

    var delta = input - now;  // milli
    if (delta < 0) return 'now';
    delta = delta/1000/60;  // min
    if (delta < 1) return 'soon';
    delta = delta/60/24;       // day
    if (delta < 1) return '<1 day';
    return Math.floor(delta) + ' days';
  }

});

app.filter('markdown', [function () {
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

app.filter('status', [function () {
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

app.filter('statusText', [function () {

    return function (value) {

      if (value == STATUSNEW)
        return "New";
      if (value == STATUSDUE)
        return "Due";
      return "Not due";

    };
}]);

app.filter("statusFilter", ['$filter', function($filter){
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


app.factory('cardStorage', ['$http', function ($http) {
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

  exports.getCards = function(id) {
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

}]);

app.controller('NavCtrl', ['$scope', function($scope) {

  $scope.collapse=true

}]);


