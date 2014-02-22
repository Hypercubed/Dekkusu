(function() {

  "use strict";

  angular.module('mainApp')
    .controller('ListCtrl', ['$scope','users',
                    function ($scope,users) {

                      console.log(users);

    $scope.users = users;

  }]);

})();
