angular.module('mainApp')
  .controller('userViewCtrl', ['$scope', '$location', '$http', '$stateParams', '$rootScope', 'angularFire', 'angularFireCollection', 'FBURL', '$state',
                      function ($scope, $location, $http, $stateParams, $rootScope, angularFire, angularFireCollection, FBURL,$state) {

    console.log('userViewCtrl',$stateParams);

    //$state.transitionTo('user.deckList');

    $scope.username = $stateParams.username || 'guest';
    $scope.deckId = $stateParams.deck || null;
    $scope.decks = [];
    $scope.listView = false;

    //console.log($stateParams);

    var ref = new Firebase(FBURL).child('decks/'+$scope.username);
    angularFire(ref, $scope, 'decks').then(function() {
      $scope.isOwner = ($scope.user) ? $scope.user.username == $scope.username : $scope.username == 'guest';
    });

  $scope.$on("angularFireAuth:login", function(evt, user) {
    $scope.isOwner = ($scope.user) ? $scope.user.username == $scope.username : $scope.username == 'guest';
  });

  $scope.$on("angularFireAuth:logout", function(evt) {
    $scope.isOwner = $scope.username == 'guest';
  });

  $scope.$on("angularFireAuth:error", function(evt, err) {
    $scope.isOwner = $scope.username == 'guest';
  });

}]);
