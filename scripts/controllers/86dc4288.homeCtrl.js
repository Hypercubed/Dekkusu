angular.module('mainApp')
  .controller('HomeCtrl', ['$rootScope','userAuth','SITE',
                  function ($rootScope,userAuth,SITE) {

  $rootScope.auth = userAuth;
  $rootScope.site = SITE;

  //console.log(SITE);

}]);
