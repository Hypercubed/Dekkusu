
(function() {
  var app = angular.module('mainApp',
      ['ui.router','ui.bootstrap', 'ui.keypress', 'ui.event', 'ngSanitize', 'firebase','ngAnimate','angularLocalStorage','ngDragDrop','md5','fireUser','ui-gravatar','angular-growl']);

  if (window.location.hostname == "127.0.0.1") {
    app
      .constant("ENV", "development")
      .constant('FBURL','https://dekkusu.firebaseio.com/')
      .constant('DEBUG', true)
      .constant('SITE', {
        title: 'Dekkusu - Dev',
        company: 'J. Harshbarger',
        year: '2013'
      });
  } else {
    app
      .constant("ENV", "production")
      .constant('FBURL','https://dekkusu-prod.firebaseio.com/')
      .constant('DEBUG', false)
      .constant('SITE', {
        title: 'Dekkusu',
        company: 'J. Harshbarger',
        year: '2013'
      });
  };

  app.config(['$logProvider', 'DEBUG',function($logProvider, DEBUG) {
    $logProvider.debugEnabled(DEBUG);
  }]);

  angular.module('fireUser').value('FireUserConfig',{
      url:"https://dekkusu.firebaseio.com/",
      datalocation:'users'
  });

  app.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
  }]);

})();

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





(function() {

  angular.module('mainApp')
    .config([
      '$stateProvider',
      '$urlRouterProvider',

    function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    // Deal with missing trailing slash
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path(), search = $location.search(), params;

      if (path[path.length - 1] !== '/') {
        return;
      }

      if (Object.keys(search).length === 0) {
        return path.slice(0,path.length-1);
      }

      params = [];
      angular.forEach(search, function(v, k){
        params.push(k + '=' + v);
      });
      return path + '?' + params.join('&');
    });

    // Resolves
    var userAuth = ['userManager', function(userManager) {
          return userManager.auth();
        } ];

    var users = ['userManager', function(userManager) {
          return userManager.getUsers();
        } ];

    var user = ['$stateParams','userManager', function($stateParams, userManager) {
                    return userManager.getUserData($stateParams.username);
                   } ];

    var rootDeck = ['$stateParams','deckManager', function($stateParams, deckManager) {
                      return deckManager.getDeck($stateParams.username);
                    }];

    var deck = ['$stateParams','deckManager', function($stateParams, deckManager) {
          return deckManager.getDeck($stateParams.username, $stateParams.deck);
        }];

    $stateProvider
      .state("authroot", {
        abstract: true,
        controller: 'HomeCtrl',
        resolve: {  userAuth: userAuth },
        templateUrl: 'components/home/rootView.html'
      })
      .state('authroot.home', {
        url: "/",
        templateUrl: 'components/home/homeView.html',
      })
      .state('authroot.readme', {
        url: "/readme",
        templateUrl: 'components/home/README.html',
      })
      .state('authroot.list', {
        url: "/users",
        controller: 'ListCtrl',
        templateUrl: 'components/users/listView.html',
        resolve: {  users: users }
      })
      .state('authroot.user', {
        abstract: true,
        url: "/:username",
        templateUrl: 'components/users/userView.html',
        controller: 'userViewCtrl',
        resolve: { rootDeck: rootDeck, user: user }
      })
      .state('authroot.user.deckList', {
        url: '',
        templateUrl: 'components/decks/deckList.html',
        controller: 'userDeckListCtrl',
        resolve: { deck: rootDeck }
      })
      .state('authroot.user.deck', {
        url: "/:deck",
        templateUrl: 'components/decks/deckList.html',
        controller: 'userDeckListCtrl',
        resolve: { deck: deck }
      });

    }]);

  angular.module('mainApp').run(['$rootScope', 'SITE','growl', function($rootScope, SITE,growl) {
    $rootScope.site = SITE;

    $rootScope.$on('$stateChangeError',
      function() {
        growl.addErrorMessage('State change error');
      });

    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams){
        growl.addSuccessMessage('State not found error');
      });

  }]);


})();

(function() {

  "use strict";

  angular.module('mainApp').
    factory('gravatarImageService', function (md5) {
        return {
            getImageSrc : function(value, size, rating, defaultUrl, secure) {
                // convert the value to lower case and then to a md5 hash
                var hash = md5.createHash(value.toLowerCase());
                var src = (secure ? 'https://secure' : 'http://www' ) + '.gravatar.com/avatar/' + hash;
                if (size) src += '?s=' + size;
                if (rating) src += '&r=' + rating;
                if (defaultUrl) src += '&d=' + defaultUrl;
                return src;
            }
        };
    });

  angular.module('mainApp').service('userManager', ['$log','$q','$location','$rootScope', 'FBURL', '$firebase', '$firebaseSimpleLogin','gravatarImageService','md5','growl',
                                            function($log,  $q,  $location,$rootScope,   FBURL,   $firebase,   $firebaseSimpleLogin,  gravatarImageService,md5,growl) {

    var self = this;
    var baseRef = new Firebase(FBURL);
    var userDataRef = baseRef.child('users');

    this.auth = function() {
      var def = $q.defer();
      var auth = $firebaseSimpleLogin(baseRef);

      $rootScope.$on('$firebaseSimpleLogin:login', fn);
      $rootScope.$on('$firebaseSimpleLogin:logout', fn);
      $rootScope.$on('$firebaseSimpleLogin:error', fn);

      function fn(evt, user) {
        def.resolve(auth);
      }

      return def.promise;
    }

    this.getUsers = function() {
      var ref = baseRef.child('users');
      return $firebase(ref);
    }

    this.getUserData = function(id) {
      var ref = userDataRef.child(id);
      return $firebase(ref);
    }

    $rootScope.$on("$firebaseSimpleLogin:login", function(evt, user) {
      growl.addSuccessMessage('Logged in as '+(user.username || user.id));

      var userData = self.getUserData(user.username || user.id);

      userData.$on('loaded', function(data) {

        userData = userData || {};

        //userData.username = user.username || user.id;
        userData.gravatar_id = md5.createHash( (user.email || user.uid).toLowerCase() );
        //userData.image_url = 'http://www.gravatar.com/avatar/' + userData.gravatar_id + '&d=retro';
        //userData.image_url = gravatarImageService.getImageSrc(user.email || user.uid, null, null, 'retro');
        //userData.deck = userData.deck || userData.username;
        userData.$save();

        $rootScope.$broadcast('userAuth:data_loaded', userData);

      });

      $rootScope.userData = userData;

    });

    $rootScope.$on("$firebaseSimpleLogin:logout", function(evt) {
      growl.addWarnMessage('Logged out','warning');
      $rootScope.userData = {};
      $location.path('/');
    });

    $rootScope.$on("$firebaseSimpleLogin:error", function(evt, err) {
        $log.error(err);
        growl.addErrorMessage('Error logging in');
      });

  }]);

})();

"use strict";

angular.module('mainApp').service('deckManager', ['FBURL', '$firebase', '$rootScope',function(FBURL, $firebase,$rootScope) {  // TODO: create provider?
  var self = this;

	var baseRef = new Firebase(FBURL);
  var decksRef = baseRef.child('decks');  // Change this to deck sets?

  this.getDeck = function(path,id) {  // Todo: don't resolve until children are loaded
    var id = id || 'root';

    var ref = decksRef.child(path+'/'+id);
    var fb = $firebase(ref);
    fb.$children = self.getChildren(path,id);  // TODO: Remove this
    return fb;
  }

  this.getChildren = function(path,id) {
    var id = id || 'root';

    var ref2 = decksRef.child(path);
    var ref1 = ref2.child(id+'/children');

    var ref = Firebase.util.intersection(
      { ref: ref1, keyMap: {'.value': 'name2'} } ,
      { ref: ref2, keyMap: ['name'] } );

    return $firebase(ref);
  };

}]);

// TODO: Create a decks api?


(function() {

  "use strict";

  angular.module('mainApp')
    .controller('HomeCtrl', ['$rootScope','userAuth',
                    function ($rootScope,userAuth) {

    $rootScope.auth = userAuth;

  }]);

})();


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

(function() {

  "use strict";

  angular.module('mainApp')
    .controller('ListCtrl', ['$scope','users',
                    function ($scope,users) {

                      console.log(users);

    $scope.users = users;

  }]);

})();
