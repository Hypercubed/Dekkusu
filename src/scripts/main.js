'use strict';

var DEBUG = false;

// Declare app level module which depends on filters, and services
var app = angular.module('mainApp', ['ui.bootstrap']);

app.controller('CardCtrl', ['$scope', 'cardStorage', '$http', function($scope, cardStorage, $http) {

  var el = angular.element(".cardEditor")[0];

  $scope.isEditing = false;
  $scope.clozed = true;

  getCard();

  $scope.$watch('card.text', function(newVal, oldVal) {
    console.log('card.text changed',newVal, oldVal);

    if (newVal == oldVal) return;

    save();
  });

  $scope.$watch('card.due', function(newVal, oldVal) {
    console.log('card.due changed',newVal, oldVal);
    if (newVal == oldVal) return;

    save();
    $scope.due = getDueCount();
  });

  function getCard() {
    $scope.cards = cardStorage.getCards();
    sortByDueDate();
    $scope.index = 0;
    $scope.card = $scope.cards[$scope.index];
    $scope.due = getDueCount();
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

  $scope.formattedCard = function getFormattedCard() {
    return $scope.card.text
      .replace(/{{(.*?)::(.*?)}}/g, '&#91;{$1}<span class="uncloze">$2</span>&#93;')
      .replace(/{{(.*?)}}/g, '&#91;{$1}<span class="uncloze">...</span>&#93;')
      .replace(/{(.*?)}/g, '<span class="cloze">$1</span>')
      .replace(/\n/g, '<br />')
      ;
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
    $scope.due = getDueCount();

    nextDue();
  }

  $scope.down = function() {
    $scope.card.due = new Date();
    $scope.card.interval = 0;
    $scope.due = getDueCount();
    nextDue();
  }

  function sortByDueDate() {
    console.log('sort');

    $scope.cards = $scope.cards.sort(function(a,b) {
      a = new Date(a.due);
      b = new Date(b.due);
      return a<b ? -1 : a>b ? 1 : 0;
    });
  };

  function getDueCount() {
    var now = new Date();
    return $scope.cards.filter(function(d) {
      return d.due < now;
    }).length;
  }

  $scope.prev = function() {
    var index = ($scope.index > 0) ? $scope.index-1 : $scope.cards.length;
    $scope.goto(index);
  }

  $scope.next = function() {
    var index = ($scope.index < $scope.cards.length-1) ? $scope.index+1 : 0;
    $scope.goto(index);
  }

  function nextDue() {
    $scope.clozed = true;
    sortByDueDate();

    $scope.goto(0);
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
    var text = getSelectedText();
    $scope.card.text = $scope.card.text.replace(text, '{'+text+'}');
  }

  $scope.b2 = function() {
    var text = getSelectedText();
    $scope.card.text = $scope.card.text.replace(text, '{{'+text+'}}');
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
        var cards = data.split('\n').map(function(c) {
          return { text: c, due: new Date(), interval: 0 }
        })

        $scope.cards = cards;
        $scope.index = 0;
        $scope.card = $scope.cards[$scope.index];
        $scope.due = getDueCount();

      });
  }

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
