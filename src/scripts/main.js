'use strict';

var DEBUG = false;

// Declare app level module which depends on filters, and services
var app = angular.module('mainApp', ['ui.bootstrap', 'ui.keypress', 'ui.event']);

app.controller('CardCtrl', ['$scope', 'cardStorage', '$http', '$filter', '$sce', function($scope, cardStorage, $http, $filter, $sce) {

  var el = angular.element(".cardEditor")[0];

  //angular.element(".cardEditor").on('blur', function() {
  //  $scope.$apply(function() {
  //    console.log('blur');
  //    $scope.edit(false);
  //  });
  //});

  $scope.isEditing = false;
  $scope.clozed = true;

  $scope.blurCallback = function() {
    console.log('blur');
  }

  $scope.keypressCallback = function(evt) {
    if (evt.keyCode == 32 || evt.keyCode == 13) {          // space
      $scope.flip();
    } else if (evt.keyCode == 37 && !$scope.clozed) {   // left
      $scope.up();
    } else if (evt.keyCode == 39 && !$scope.clozed) {   // right
      $scope.down();
    }
  }

  function getCards() {
    $scope.cards = cardStorage.getCards();

    //if ($scope.onlydue) {
      //$scope.cards = $filter('dueNow')($scope.cards);
    //}

    nextDue();
  }

  function save() {
    console.log('saving to local storage');
    cardStorage.saveCards($scope.cards);
  };

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
  }

  $scope.up = function() {
    // Cheap algroithim
    //    n = 1   when n = 0  (view one day later)
    //    n = 2*n otherwise   (view 2*n days later)

    var interval = ($scope.interval > 0) ? $scope.interval*2 : 1;
    var due = (new Date()).getDate()+interval;

    $scope.card.interval = interval;
    $scope.card.due.setDate(due);

    nextDue();
  }

  $scope.down = function() {
    $scope.card.due = new Date();
    $scope.card.interval = 0;
    nextDue();
  }

  $scope.prev = function() {
    var index = ($scope.index > 0) ? $scope.index : $scope.cards.length;
    $scope.goto(index-1);
  }

  $scope.next = function() {
    var index = ($scope.index < $scope.cards.length-1) ? $scope.index+1 : 0;
    $scope.goto(index);
  }

  function nextDue() {
    // Check this... first due or next due
    $scope.clozed = true;

    var index = $filter('firstDueIndex')($scope.cards)
    $scope.goto(index);
  }

  $scope.goto = function(index) {

    if (index > $scope.cards.length)
      index = $scope.cards.length;

    if (index < 0)
      $scope.index = 0;

    $scope.index = index;
    $scope.card = $scope.cards[$scope.index];
  }

  function addCard(card) {
    card = card || {};
    card.text = card.text || '';
    card.due = card.due || (new Date());
    card.interval = card.interval || 0;

    return $scope.cards.push(card)-1
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

    var id = addCard({ text: text });
    $scope.goto(id);
    $scope.isEditing = true;

  }

  $scope.deleteCard = function() {
    $scope.cards.splice($scope.index,1);
    $scope.goto($scope.index);
  }

  $scope.reset = function() {
    $http.get('data/first30.txt')
      .success(function (data, status, headers, config) {
        $scope.cards = data.split('\n').map(function(c) {
          c = c.replace(/\\n/g, '\n');
          return { text: c, due: new Date(), interval: 0 }
        });

        save();
        getCards();

      });
  }

  $scope.dueNow = function dueNow(c) {
    var now = new Date();
    return c.due < now;
  }

  getCards();

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

}]);

app.filter('formatCard', ['$sce', function ($sce) {

  var furigana = function(converter) {
    return [
        { type: 'lang', regex: '\\{\\[(.*?)\\]\\}', replace: '[{$1}]' }
      //, { type: 'lang', regex: ' (.*?)\\[(.*?)\\]', replace: '<ruby><rb>$1</rb><rt>$2</rt></ruby>' }
      , { type: 'lang', regex: '\\s(.[^\\s]?)\\[(.*?)\\]', replace: '<ruby><rb>$1</rb><rt>$2</rt></ruby>' }
      //{ type: 'lang', regex: '\\[(.*?)\\]\\((.*?)\\)', replace: '<ruby><rb>$1</rb><rt>$2</rt></ruby>' }
      //{ type: 'lang', regex: '(.)\\[(.*?)\\]', replace: '<ruby><rb>$1</rb><rt>$2</rt></ruby>' }
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
    return $sce.trustAsHtml(showdown.makeHtml(input || ''));
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

app.filter('markdown', ['$sce', function ($sce) {
    var converter = new Showdown.converter();
    return function (value) {
        return $sce.trustAsHtml(converter.makeHtml(value || ''));
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
