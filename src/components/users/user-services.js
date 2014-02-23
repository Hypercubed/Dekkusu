(function() {

  "use strict";

  angular.module('mainApp').
    factory('gravatarImageService', ['md5', function (md5) {
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
    }]);

  angular.module('mainApp').service('userManager', ['$log','$q','$location','$rootScope', 'FBURL', '$firebase', '$firebaseSimpleLogin','gravatarImageService','md5','growl',
                                            function($log,  $q,  $location,$rootScope,   FBURL,   $firebase,   $firebaseSimpleLogin,  gravatarImageService,md5,growl) {

    var self = this;
    var baseRef = new Firebase(FBURL);
    var userDataRef = baseRef.child('users');

    this.auth = function() {
      var def = $q.defer();
      var auth = $firebaseSimpleLogin(baseRef);

      $rootScope.$on('$firebaseSimpleLogin:login', fn);
      $rootScope.$on('$firebaseSimpleLogin:logout', fn);
      $rootScope.$on('$firebaseSimpleLogin:error', fn);

      function fn(evt, user) {
        def.resolve(auth);
      }

      return def.promise;
    }

    //this.getUsers = function() {
    //  var ref = baseRef.child('users');
    //  return $firebase(ref);
    //}

    function $firebasePromise(ref) {  // A services?
      var def = $q.defer();
      var fb = $firebase(ref);
      ref.on('value', function() {
        def.resolve(fb);
      });
      return def.promise;
    }

    this.getUsers = function() {
      var ref = baseRef.child('users');
      return $firebasePromise(ref);
    }

    this.getUser = function(id) {
      var ref = userDataRef.child(id);
      return $firebasePromise(ref);
    }

    //this.getUserData = function(id) {
    //  var ref = userDataRef.child(id);
    //  return $firebase(ref);
    //}

    $rootScope.$on("$firebaseSimpleLogin:login", function(evt, user) {
      $rootScope.$apply(function() {
        growl.addSuccessMessage('Logged in as '+(user.username || user.id));
      });

      $rootScope.userData = {};

      var userPromise = self.getUser(user.username || user.id);
      userPromise.then(function(data) {

        data = data || {};
        data.gravatar_id = md5.createHash( (user.email || user.uid).toLowerCase() );
        data.$save();

        $rootScope.$broadcast('userAuth:data_loaded', data);
        $rootScope.userData = data;

      });

      /*var userData = self.getUserData(user.username || user.id);

      userData.$on('loaded', function(data) {

        userData = userData || {};

        //userData.username = user.username || user.id;
        userData.gravatar_id = md5.createHash( (user.email || user.uid).toLowerCase() );
        //userData.image_url = 'http://www.gravatar.com/avatar/' + userData.gravatar_id + '&d=retro';
        //userData.image_url = gravatarImageService.getImageSrc(user.email || user.uid, null, null, 'retro');
        //userData.deck = userData.deck || userData.username;
        userData.$save();

        $rootScope.$broadcast('userAuth:data_loaded', userData);

      });*/

      //$rootScope.userData = userData;

    });

    $rootScope.$on("$firebaseSimpleLogin:logout", function(evt) {

      $rootScope.$apply(function() {
        growl.addWarnMessage('Logged out','warning');
        $rootScope.userData = {};
      });

      $location.path('/');
    });

    $rootScope.$on("$firebaseSimpleLogin:error", function(evt, err) {
      $log.error(err);

      $rootScope.$apply(function() {
        growl.addErrorMessage('Error logging in');
        $rootScope.userData = {};
      });

    });

  }]);

})();
