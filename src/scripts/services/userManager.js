"use strict";

angular.module('mainApp').service('userAuth', ['$log','$rootScope', 'FBURL', '$firebase', '$firebaseSimpleLogin',
                                       function($log,$rootScope,   FBURL,   $firebase,   $firebaseSimpleLogin) {  // TODO: create provider

  var ref = new Firebase(FBURL);
  var auth = $firebaseSimpleLogin(ref);

  $rootScope.$on("$firebaseSimpleLogin:login", function(evt, user) {
    console.log('user',user);

    //var userRef = ref.child('userData/' + user.username);

    //var _ = $firebase(userRef);
    //_.$bind($rootScope, 'userData', function() {
    //  return {listView: false};  // Change to localStorage
    //});

  });

  $rootScope.$on("$firebaseSimpleLogin:logout", function(evt) {
    //$rootScope.userData = null;
  });

  $rootScope.$on("$firebaseSimpleLogin:error", function(evt, err) {
    $log.error(err);
  });

  return auth;

}]);
