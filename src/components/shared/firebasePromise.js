'use strict';

angular.module('mainApp')
  .factory('$firebasePromise', ['$firebase','$q', function $firebasePromiseService($firebase,$q) {

    return function $firebasePromise(ref) {  // A services?
      var fb = $firebase(ref);
      var def = $q.defer();

      fb.$on('loaded', function() {
        def.resolve(fb);
      });

      fb.$promise = def.promise;
      return fb;
    }

  }]);
