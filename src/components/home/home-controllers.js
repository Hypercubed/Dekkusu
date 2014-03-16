
(function() {

  "use strict";

  angular.module('mainApp')
    .controller('HomeCtrl', ['$scope', '$rootScope','userAuth','deckManager',
                    function ($scope, $rootScope,userAuth,deckManager) {

    $rootScope.auth = userAuth;

    $scope.children = null;
    $scope.isCollapsed = true;

    $scope.toggleChildren = function() {  // TODO: Make this logic into a directive.

      if ($scope.children == null && $scope.isCollapsed) {

        $scope.children = deckManager
          .getChildren(userAuth.user.username || userAuth.user.id)
          .$on('loaded', function(data) {
            console.log($scope.children);
            $scope.isCollapsed = false;
          });

      } else {
        $scope.isCollapsed = !$scope.isCollapsed;
      }

    }

  }]);

})();
