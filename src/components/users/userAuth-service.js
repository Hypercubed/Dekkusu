"use strict";

angular.module('mainApp').service('userAuth', ['$location', '$log','$rootScope', 'FBURL', '$firebase', '$firebaseSimpleLogin',
                                       function($location,$log,$rootScope,   FBURL,   $firebase,   $firebaseSimpleLogin) {  // TODO: create provider

  var baseRef = new Firebase(FBURL);
  var userDataRef = baseRef.child('userData');
  var decksRef = baseRef.child('decks');

  var auth = $firebaseSimpleLogin(baseRef);

  $rootScope.userData = {};

  $rootScope.$on("$firebaseSimpleLogin:login", function(evt, user) {
    //console.log(user);

    var deckName = user.username || user.id;

    var ref = userDataRef.child(user.uid);
    $rootScope.userData = $firebase(ref);

    $rootScope.userData.$on('loaded', function(data) {

      $rootScope.userData = $rootScope.userData || {};

      $rootScope.userData.username = user.username || user.id;
      $rootScope.userData.gravatar_id = user.gravatar_id || "000";
      

      if (!$rootScope.userData.deck) {  // New deck, TODO: Check if deck exists
        $rootScope.userData.deck = $rootScope.userData.username;

        var fb = decksRef  // Should use deckManager
          .child($rootScope.userData.deck);


        fb.child('gravatar_id')
          .set($rootScope.userData.gravatar_id);

        fb.child('owner')
          .set(user.uid);

      }

      $rootScope.userData.$save();

    });

  });

  $rootScope.$on("$firebaseSimpleLogin:logout", function(evt) {
    $rootScope.userData = {};
    $location.path('/');
  });

  $rootScope.$on("$firebaseSimpleLogin:error", function(evt, err) {
    $log.error(err);
  });

  return auth;

}]);
