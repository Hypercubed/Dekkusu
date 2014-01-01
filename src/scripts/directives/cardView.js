'use strict';

angular.module('mainApp').directive('cardView', [function() {
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
        }

        scope.edit = function(flag) {
          if (arguments.length < 1) flag = !scope.isEditing;
          scope.isEditing = flag;
          if (!flag) {
            //console.log(scope.cards, scope.card);
            scope.cards.$save(scope.card.$id);
          }
        }

        scope.flip = function() {
          scope.clozed = !scope.clozed;
        }

        scope.up = function() {
          // Cheap algroithim
          //    n = 1   when n = 0  (view one day later)
          //    n = 2*n otherwise   (view 2*n days later)

          scope.card.last = Date.now();

          if ((scope.card.due - scope.card.last) <= 0)                                        // if card is due
            scope.card.interval = (scope.card.interval > 0) ? scope.card.interval*2 : 1;     // Increase interval

          scope.card.due = scope.card.last+scope.card.interval*DAYS;
          scope.cards.update(card);

          scope.clozed = true;
          //scope.applyFilter();
        }

        scope.down = function() {
          scope.card.due = scope.card.last = Date.now()-5;
          scope.card.interval = 0;
          scope.cards.update(card);

          scope.clozed = true;
          //scope.applyFilter();
        }

        scope.add = function() {

          var text = getSelectedText();

          var card = {};
          card.text = text || '';
          card.due = card.due || Date.now();
          card.interval = card.interval || 0;

          scope.cards.add(card);
          scope.edit(true);
        }

      }
    };
  }]);
