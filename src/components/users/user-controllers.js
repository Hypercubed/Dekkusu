  angular.module('mainApp')
    .controller('UsersCtrl', ['$scope','users',
                    function ($scope,users) {

                      console.log(users);

    $scope.users = users;

  }]);

angular.module('mainApp')

  // This should be a set controller
  .controller('UserCtrl', ['$scope','$rootScope', '$state','$stateParams','rootDeck','user', 'storage',
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


