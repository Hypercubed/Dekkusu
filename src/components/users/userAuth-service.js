"use strict";

angular.module('mainApp').service('userAuth', ['$location', '$log','$rootScope', 'FBURL', '$firebase', '$firebaseSimpleLogin','deckManager','md5',
                                       function($location,   $log,  $rootScope,   FBURL,   $firebase,   $firebaseSimpleLogin,deckManager,md5) {  // TODO: create provider

  var baseRef = new Firebase(FBURL);
  var userDataRef = baseRef.child('users');

  var auth = $firebaseSimpleLogin(baseRef);

  $rootScope.userData = {};

  $rootScope.$on("$firebaseSimpleLogin:login", function(evt, user) {
    //console.log(user);

    var deckName = user.username || user.id;

    var ref = userDataRef.child(user.uid);
    var userData = $rootScope.userData = $firebase(ref);

    userData.$on('loaded', function(data) {

      userData = userData || {};

      userData.username = user.username || user.id;
      userData.gravatar_id = user.gravatar_id || md5.createHash(user.id);
      userData.deck = userData.deck || userData.username;
      userData.$save();

      var rootDeck = deckManager.getDeck(userData.deck);   // Todo: check if deck name is unique
      rootDeck.image_url = 'http://www.gravatar.com/avatar/'+$rootScope.userData.gravatar_id+'?s=50&d=retro';
      rootDeck.owner = user.uid;
      rootDeck.name = rootDeck.name || $rootScope.userData.username;
      rootDeck.$save();

    });

  });

  $rootScope.$on("$firebaseSimpleLogin:logout", function(evt) {
    // TODO: remove guest decks on logout

    $rootScope.userData = {};
    $location.path('/');
  });

  $rootScope.$on("$firebaseSimpleLogin:error", function(evt, err) {
    $log.error(err);
  });

  return auth;

}]);
