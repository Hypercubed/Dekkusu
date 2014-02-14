angular.module('mainApp')
  .controller('HomeCtrl', ['$rootScope','$log','userAuth','SITE',
                  function ($rootScope,$log,userAuth,SITE) {

  $rootScope.auth = userAuth;
  $rootScope.site = SITE;
  $rootScope.log = $log;

  //console.log(SITE);

}]);
