'use strict';

var SECONDS = 1000;
var MINS = 60*SECONDS;
var HOURS = 60*MINS;
var DAYS = 24*HOURS;  // 1 day in milliseconds

var PROGRESS = [5*MINS,1*HOURS,1*DAYS,3*DAYS,7*DAYS,30*DAYS,60*DAYS,365*DAYS];

// TODO: Don't do this
var STATUSALL = -1;
var STATUSNEW = 0;
var STATUSDUE = 1;
var STATUSDONE = 2;

angular.module('mainApp').directive('cardView', ['statusFilter', 'statusTextFilter', function(statusFilter, statusTextFilter) {
    return {
      scope: {
        card: '=',
        cards: '=',
        isOwner: '=',
        ngClass: '=',
        listview: '='
      },
      templateUrl: 'partials/cardView.html',
      link: function(scope, element, attrs) {

        scope.isEditing = false;
        scope.clozed = true;

        update();

        function update() {
          scope.card.$priority = scope.card.due;
          scope.status = statusFilter(scope.card);
          scope.statusText = statusTextFilter(scope.status);
        }

        function save() {
          update();
          scope.cards.$save(scope.card.$id);
        }

        console.log(scope.card);

        /* var el = angular.element(".cardEditor")[0];

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

        scope.wrap = function wrap(left, right) {
          var ws = window.getSelection();

          var start = el.selectionStart;
          var end = el.selectionEnd;

          var val = scope.card.text;
          scope.card.text = val.slice(0,start) + left + val.slice(start,end) + right + val.slice(end);

          setTimeout(function() {
            el.selectionStart = start+left.length;
            el.selectionEnd = end+left.length;
          }, 100);
        } */

        scope.edit = function(flag) {
          if (arguments.length < 1) flag = !scope.isEditing;
          scope.isEditing = flag;
          if (!flag) {
            save();
          }
        }

        scope.flip = function() {
          scope.clozed = !scope.clozed;
        }

        scope.up = function() {
          // Cheap algroithim
          //    n = 1   when n = 0  (view one day later)
          //    n = 2*n otherwise   (view 2*n days later)

          var now = Date.now();

          scope.card.last = scope.card.last || now;
          scope.card.due = scope.card.due || scope.card.last-1;

          var interval = scope.card.due - scope.card.last;

          if (scope.card.due - now >= 0) {  // If card was due, increase interval
            interval = (interval > 0) ? 2 * interval : 5*MINS;
          }

          scope.card.last = now;
          scope.card.due = now+interval;

          save();

          scope.clozed = true;
        }

        scope.down = function() {
          scope.card.last = Date.now();
          scope.card.due = scope.card.last;
          scope.card.interval = 0;
          save();

          scope.clozed = true;
        }

        /* scope.add = function() {

          var text = getSelectedText();

          var card = {};
          card.text = text || '';
          card.due = card.due || Date.now();
          card.interval = card.interval || 0;

          scope.cards.add(card);
          scope.edit(true);
        } */

      }
    };
  }]);
