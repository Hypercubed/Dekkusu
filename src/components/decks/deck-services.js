"use strict";

angular.module('mainApp').service('deckManager', ['FBURL', '$firebase', '$rootScope','$q',
                                          function(FBURL,   $firebase,   $rootScope,  $q) {  // TODO: create provider?

  var self = this;

	var baseRef = new Firebase(FBURL);
  var decksRef = baseRef.child('decks');  // Change this to deck sets?

  function $firebasePromise(ref) {  // A services?
    var def = $q.defer();
    var fb = $firebase(ref);
    ref.on('value', function() {
      def.resolve(fb);
    });
    return def.promise;
  }

  this.getDeck = function(path,id) {
    var id = id || 'root';
    var ref = decksRef.child(path+'/'+id);
    return $firebasePromise(ref);
  }

  this.getChildren = function(path,id) {

    var id = id || 'root';

    var ref2 = decksRef.child(path);
    var ref1 = ref2.child(id+'/children');

    var ref = Firebase.util.intersection(
      { ref: ref1, keyMap: {'.value': 'name2'} } ,
      { ref: ref2, keyMap: ['name','children'] } );

    return $firebasePromise(ref);
  };

}]);

// TODO: Create a decks api?
