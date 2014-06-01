"use strict";

angular.module('mainApp').service('deckManager', ['FBURL', '$firebase', '$rootScope','$q','$firebasePromise',
                                          function(FBURL,   $firebase,   $rootScope,  $q, $firebasePromise) {  // TODO: create provider?

  var self = this;

  var baseRef = new Firebase(FBURL);
  var decksRef = baseRef.child('decks');  // Change this to deck sets?

  /* function $firebasePromise(ref) {  // A services?
    var fb = $firebase(ref);

    var def = $q.defer();
    fb.$on('loaded', function() {
      def.resolve(fb);
    });

    fb.$promise = def.promise;

    return fb;
  } */

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

  this.move = function(srcpath, topath, id) {
    var oldRef = decksRef.child(path).child(id);
    var newRef = decksRef.child(topath);
    oldRef.once('value', function(snap)  {
      newRef.set( snap.value(), function(error) {
        if( !error ) {  oldRef.remove(); }
        else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
      });
    });

  };

  //this.move

}]);

// TODO: Create a decks api?
