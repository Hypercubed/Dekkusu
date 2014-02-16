"use strict";

angular.module('mainApp').service('userAuth', ['$location', '$log','$rootScope', 'FBURL', '$firebase', '$firebaseSimpleLogin','md5',
                                       function($location,   $log,  $rootScope,   FBURL,   $firebase,   $firebaseSimpleLogin,md5) {  // TODO: create provider

  var baseRef = new Firebase(FBURL);
  var userDataRef = baseRef.child('users');

  var auth = $firebaseSimpleLogin(baseRef);

  $rootScope.userData = {};

  $rootScope.$on("$firebaseSimpleLogin:login", function(evt, user) {
    //console.log('$firebaseSimpleLogin:login', 'userAuth');

    var ref = userDataRef.child(user.uid);
    var userData = $rootScope.userData = $firebase(ref);

    userData.$on('loaded', function(data) {
      //console.log('data',data);

      userData = userData || {};

      userData.username = user.username || user.id;  // Only do this on new user??
      userData.gravatar_id = user.gravatar_id || md5.createHash(user.id);
      userData.deck = userData.deck || userData.username;
      userData.$save();

      $rootScope.$broadcast('userAuth:data_loaded', userData);

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
