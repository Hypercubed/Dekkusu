
(function() {
  var app = angular.module('mainApp',
      [
        'ui.router'
        ,'ui.bootstrap'
        , 'ui.keypress'
        , 'ui.event'
        , 'ngSanitize'
        , 'firebase'
        ,'ngAnimate'
        ,'angularLocalStorage'
        ,'angularjs-gravatardirective.services'
        ,'angular-growl'
        //,'ngFitText'
        ,'ui.jq'
        ,'ngDragDrop'
      ]);

  if (window.location.hostname == "127.0.0.1") {
    app
      .constant("ENV", "development")
      .constant('FBURL','https://dekkusu.firebaseio.com/')
      .constant('DEBUG', true)
      .constant('SITE', {
        title: 'Dekkusu - Dev',
        company: 'J. Harshbarger',
        year: '2014'
      });
  } else {
    app
      .constant("ENV", "production")
      .constant('FBURL','https://dekkusu-prod.firebaseio.com/')
      .constant('DEBUG', false)
      .constant('SITE', {
        title: 'Dekkusu',
        company: 'J. Harshbarger',
        year: '2014'
      });
  };

  app.config(['$logProvider', 'DEBUG',function($logProvider, DEBUG) {
    $logProvider.debugEnabled(DEBUG);
  }]);

  app.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
  }]);

})();
