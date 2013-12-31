angular.module('mainApp')
  .controller('HomeCtrl', ['$scope', '$rootScope','angularFireAuth', '$location',
                  function ($scope, $rootScope, angularFireAuth, $location) {

  $scope.login = function() {
    angularFireAuth.login("github");
  };

  $scope.$on("angularFireAuth:login", function(evt, user) {
    $location.path('/'+user.username);
  });

  $scope.$on("angularFireAuth:logout", function(evt) {
    $location.path('/');
  });

  $scope.$on("angularFireAuth:error", function(evt, err) {
    //
  });

}]);