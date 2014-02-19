(function() {

  "use strict";

  angular.module('mainApp')
    .controller('ListCtrl', ['$scope','$firebase','FBURL',
                    function ($scope,$firebase,FBURL) {

    var usersRef = new Firebase(FBURL).child('users');
    var setsRef = new Firebase(FBURL).child('sets');

    $scope.users = $firebase(usersRef);
    $scope.sets = $firebase(setsRef);

  }]);

})();
