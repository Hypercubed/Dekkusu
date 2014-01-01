angular.module('mainApp')
  .controller('HomeCtrl', ['$scope', '$rootScope','$location',
                  function ($scope, $rootScope, $location) {

  $scope.$on("$firebaseAuth:login", function(evt, user) {
    $location.path('/'+user.username);
  });

  $scope.$on("$firebaseAuth:logout", function(evt) {
    $location.path('/');
  });

  $scope.$on("$firebaseAuth:error", function(evt, err) {
    console.log(err);
  });

}]);
