
(function() {

  "use strict";

  angular.module('mainApp')
    .controller('HomeCtrl', ['$rootScope','userAuth',
                    function ($rootScope,userAuth) {

    $rootScope.auth = userAuth;

  }]);

})();
