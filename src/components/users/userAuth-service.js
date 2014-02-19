(function() {

  "use strict";

  angular.module('mainApp').
    factory('gravatarImageService', function (md5) {
        return {
            getImageSrc : function(value, size, rating, defaultUrl, secure) {
                // convert the value to lower case and then to a md5 hash
                var hash = md5.createHash(value.toLowerCase());
                var src = (secure ? 'https://secure' : 'http://www' ) + '.gravatar.com/avatar/' + hash;
                if (size) src += '?s=' + size;
                if (rating) src += '&r=' + rating;
                if (defaultUrl) src += '&d=' + defaultUrl;
                return src;
            }
        };
    });

  angular.module('mainApp').service('userManager', ['$log','$location','$rootScope', 'FBURL', '$firebase', '$firebaseSimpleLogin','gravatarImageService','md5',
                                         function($log,$location,$rootScope,   FBURL,   $firebase,   $firebaseSimpleLogin,  gravatarImageService,md5) {

    var self = this;
    var baseRef = new Firebase(FBURL);
    var userDataRef = baseRef.child('users');

    this.auth = $firebaseSimpleLogin(baseRef);

    this.getUserData = function(uid) {
      var ref = userDataRef.child(uid);
      return $firebase(ref);
    }

    $rootScope.$on("$firebaseSimpleLogin:login", function(evt, user) {

      var userData = self.getUserData(user.uid);

      userData.$on('loaded', function(data) {

        userData = userData || {};

        userData.username = user.username || user.id;  // Only do this on new user??
        userData.gravatar_id = md5.createHash( (user.email || user.uid).toLowerCase());
        //userData.image_url = 'http://www.gravatar.com/avatar/' + userData.gravatar_id + '&d=retro';
        userData.image_url = gravatarImageService.getImageSrc(user.email || user.uid, null, null, 'retro');
        userData.deck = userData.deck || userData.username;
        userData.$save();

        $rootScope.$broadcast('userAuth:data_loaded', userData);

      });

      $rootScope.userData = userData;

    });

    $rootScope.$on("$firebaseSimpleLogin:logout", function(evt) {
      $rootScope.userData = {};
      $location.path('/');
    });

    $rootScope.$on("$firebaseSimpleLogin:error", function(evt, err) {
      $log.error(err);
    });

  }]);

})();
