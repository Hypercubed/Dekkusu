  angular.module('mainApp')
    .controller('AlertsCtrl', ['$rootScope','$scope','$timeout','growl',
                    function ($rootScope,$scope,$timeout,growl) {

    $scope.alerts = [];

    $scope.addAlert = function(msg,type) {  // TODO: move these to a service
      var alert = {msg: msg}
      if (type) alert.type = type;

      alert.$timeout = $timeout(function() { $scope.closeAlert(alert) }, 5000);

      $scope.alerts.push(alert);
      $scope.$apply();
    };

    $scope.closeAlert = function(alert) {
      var index = $scope.alerts.indexOf(alert);
      if (alert.$timeout) {$timeout.cancel(alert.$timeout)};
      if (index > -1) $scope.alerts.splice(index, 1);
    };

    /*$rootScope.$on('$stateChangeError',
      function() {
        $scope.addAlert('$stateChangeError');
      });

    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams){
        $scope.addAlert('$stateNotFound');
        console.log(unfoundState.to);
        console.log(unfoundState.toParams);
        console.log(unfoundState.options);
      });

    $rootScope.$on('$firebaseSimpleLogin:error',   // Add event listeners somewhere else
      function() {
        $scope.addAlert('Error logging in');
      });

    $rootScope.$on('$firebaseSimpleLogin:login',
      function(evt,user) {
        //$scope.addAlert('Logged in as '+(user.username || user.id),'success');
        growl.addSuccessMessage('Logged in as '+(user.username || user.id));
      });

    $rootScope.$on('$firebaseSimpleLogin:logout',
      function(evt,user) {
        $scope.addAlert('Logged out','warning');
      });*/

  }]);
