
(function() {

  "use strict";

  angular.module('mainApp')
    .controller('HomeCtrl', ['$scope', '$rootScope','userAuth','deckManager','growl',
                    function ($scope, $rootScope,userAuth,deckManager,growl) {

    $rootScope.auth = userAuth;

    $scope.children = null;
    $scope.isCollapsed = true;

    $scope.toggleChildren = function() {  // TODO: Make this logic into a directive.

      if ($scope.children == null && $scope.isCollapsed) {

        $scope.children = deckManager
          .getChildren(userAuth.user.username || userAuth.user.id)
          .$on('loaded', function(data) {
            //console.log($scope.children);
            $scope.isCollapsed = false;
          });

      } else {
        $scope.isCollapsed = !$scope.isCollapsed;
      }
    }

    if (userAuth.user) {
      $scope.toggleChildren();
    }

    $scope.drop = function(evt,obj,dropId) {
      dropId = dropId || 'root';

      var dragId = obj.draggable.scope().$eval('id');
      var deck = obj.draggable.scope().$eval('deck');

      var srcObj = deck.children[dragId];

      console.log(deck);
      return;

      $scope.children.$child(dropId+'/children/'+dragId).$set(srcObj).then(function() {
        if (dropId === deck.$id) {return};

        if (!evt.altKey) {
          delete deck.children[dragId];
          deck.$remove('children/'+dragId);
          growl.addSuccessMessage('Deck moved');
        } else {
          growl.addSuccessMessage('Deck copied');
        }
      });

    }

  }]);

})();
