angular.module('mainApp')
  .controller('HomeCtrl', ['$scope', '$rootScope','$location','$firebaseAuth', 'FBURL',
                  function ($scope, $rootScope, $location,$firebaseAuth, FBURL) {

  /* var ref = new Firebase(FBURL);
  $rootScope.auth = $firebaseAuth(ref);

  $rootScope.$on("$firebaseAuth:login", function(evt, user) {
    console.log('Logged in as',user.username);
  });

  $rootScope.$on("$firebaseAuth:logout", function(evt) {
    //$location.path('/');
  });

  $rootScope.$on("$firebaseAuth:error", function(evt, err) {
    console.log(err);
  }); */

}]);
