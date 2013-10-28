'use strict';

var DEBUG = false;

// Declare app level module which depends on filters, and services
var app = angular.module('mainApp', ['ui.bootstrap', 'ui.keypress', 'ui.event']);

app.controller('CardCtrl', ['$scope', 'cardStorage', '$http', '$filter','$location', function($scope, cardStorage, $http, $filter, $location) {

  console.log($location.path());

  var el = angular.element(".cardEditor")[0];

  //angular.element(".cardEditor").on('blur', function(e) {
 //   if (!e.relatedTarget) {
  //    $scope.$apply(function() {
  //      console.log('blur');
  //      $scope.edit(false);
  //    });
  //  }
  //});

  function init() {
    $scope.isEditing = false;  // TODO: replace with $scope.editedCard;
    $scope.clozed = true;

    if ($location.path() == '/all') {
      $scope.filter = 0;
    } if ($location.path() == '/soon') {
      $scope.filter = 1;
    } else {
      $scope.filter = 0;
    }

    getCards();
  }

  function getCards() {
    $scope.cards = cardStorage.getCards();
    $scope.index = 0;
    applyFilter($scope.filter);
  }

  function applyFilter(filter) {
    $scope.filter = filter = filter || $scope.filter;

    var now = (new Date()).getDate();

    $scope.filteredCards = $scope.cards.filter(function(d) {
      if (filter < 0) return true;
      return (d.due.getDate() - now <= filter);
    }).sort(function(a,b) {
      return a.due<b.due?-1:a.due>b.due?1:0;
    });

    $scope.goto($scope.index);
  }

  $scope.blurCallback = function() {
    console.log('blur');
  }

  function save() {
    cardStorage.saveCards($scope.cards);
  };

  function nextDue() {
    $scope.clozed = true;

    for (var i = $scope.index; i < $scope.filteredCards.length; i++) {
      console.log($scope.filteredCards[i].due);
    }

    var index = $filter('firstDueIndex')($scope.filteredCards);
    $scope.goto(0);
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

  function addBracket(left, right) {
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

  $scope.flip = function() {
    $scope.clozed = !$scope.clozed;
    $scope.isEditing = false;
  }

  $scope.edit = function(flag) {
    if (arguments.length < 1) flag = !$scope.isEditing;
    $scope.isEditing = flag;
    //console.log('edit',flag);
  }

  $scope.up = function() {
    // Cheap algroithim
    //    n = 1   when n = 0  (view one day later)
    //    n = 2*n otherwise   (view 2*n days later)

    var interval = ($scope.card.interval > 0) ? $scope.card.interval*2 : 1;
    var due = (new Date()).getDate()+interval;

    $scope.card.interval = interval;
    $scope.card.due.setDate(due);

    $scope.clozed = true;
    applyFilter();
  }

  $scope.down = function() {
    $scope.card.due = new Date();
    $scope.card.interval = 0;

    $scope.clozed = true;
    applyFilter();
  }

  $scope.prev = function() {
    var index = ($scope.index > 0) ? $scope.index : $scope.filteredCards.length;
    $scope.goto(index-1);
  }

  $scope.next = function() {
    var index = ($scope.index < $scope.filteredCards.length-1) ? $scope.index+1 : 0;
    $scope.goto(index);
  }

  $scope.b1 = function() {
    //var text = getSelectedText();
   // $scope.card.text = $scope.card.text.replace(text, '{'+text+'}');

    addBracket('{','}');
  }

  $scope.b2 = function() {
    //var text = getSelectedText();
    //$scope.card.text = $scope.card.text.replace(text, '{{'+text+'}}');

    addBracket('{{','}}');
  }

  $scope.add = function() {

    var text = getSelectedText();

    var card = {};
    card.text = text || '';
    card.due = card.due || (new Date());
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

  $scope.reset = function() {
    $http.get('data/first30.txt')
      .success(function (data, status, headers, config) {
        $scope.cards = data.split('\n')
        .filter(function(t) {
          return t != '';
        })
        .map(function(c) {
          c = c.replace(/\\n/g, '\n');
          return { text: c, due: new Date(), interval: 0 }
        });

        save();
        getCards();

      });
  }

  $scope.clear = function() {
    $scope.cards = [];

    save();
    getCards();
  }

  $scope.dueNow = function dueNow(c) {
    var now = new Date();
    return c.due < now;
  }

  init();

  $scope.$watch('card.text', function(newVal, oldVal) {
    console.log('card.text changed',newVal, oldVal);

    if (newVal == oldVal) return;

    save();
  });

  $scope.$watch('card.due', function(newVal, oldVal) {
    console.log('card.due changed',newVal, oldVal);
    if (newVal == oldVal) return;

    save();
  });

  $scope.$watch('filter', function(newVal, oldVal) {
    console.log('filter changed',newVal, oldVal);
    if (newVal == oldVal) return;

    applyFilter(newVal);

  });

}]);

app.filter('formatCard', [function () {

  var furigana = function(converter) {
    return [
      { type: 'lang', regex: '(\\S*)\\{\\[(.*?)\\]\\}', replace: '$1[{$2}]' },
      { type: 'lang', regex: '(\\S*)\\[(.*?)\\]', replace: '<ruby><rb>$1</rb><rt>$2</rt></ruby>' }
    ];
  }

  var cloze = function(converter) {
    return [
      { type: 'lang', regex: '{{(.*?)::(.*?)}}', replace: '&#91;{$1}<span class="uncloze">$2</span>&#93;' },
      { type: 'lang', regex: '{{(.*?)}}', replace: '&#91;{$1}<span class="uncloze">...</span>&#93;' },
      { type: 'lang', regex: '{(.*?)}', replace: '<span class="cloze">$1</span>' }
    ];
  }

  var showdown = new Showdown.converter({ extensions: [ furigana, cloze ] });

  return function getFormattedCard(input) {
    //var md = cloze(input);
    //return $sce.trustAsHtml(showdown.makeHtml(input || ''));
    return showdown.makeHtml(input || '');  // Check sanitization
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
    var now = new Date();
    return input.filter(function(d) {
      return d.due < now;
    });
  }

});

app.filter('dateDays', function() {
  var now = new Date();
  return function dueNow(input) {
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

app.factory('cardStorage', ['$http', function ($http) {
  var STORAGE_ID = 'cards-app-cards';

  var exports = {};

  exports.getCards = function() {
    var json = localStorage.getItem(STORAGE_ID);

    if (json) {
      var cards = JSON.parse(json);
      cards.forEach(function(c) {
        var milli = Date.parse(c.due);
        c.due = new Date(milli);
      });
      return cards;
    } else {
      return [];
    }

  }

  exports.saveCards = function (cards) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(cards));
  }

  return exports;

}]);
