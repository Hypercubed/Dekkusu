"use strict";

angular.module('mainApp').service('deckManager', ['FBURL', '$firebase', '$rootScope','$q',
                                          function(FBURL,   $firebase,   $rootScope,  $q) {  // TODO: create provider?

  var self = this;

	var baseRef = new Firebase(FBURL);
  var decksRef = baseRef.child('decks');  // Change this to deck sets?

  this.getDeck = function(path,id) {  // Todo: don't resolve until children are loaded
    var def = $q.defer();
    var id = id || 'root';

    var ref = decksRef.child(path+'/'+id);
    var fb = $firebase(ref);
    //fb.$children = self.getChildren(path,id);  // TODO: Remove thi

    ref.on('value', function() {
      def.resolve(fb);
    });

    //return fb;
    return def.promise;
  }

  this.getChildren = function(path,id) {  // TODO: make a promise
    var id = id || 'root';

    var ref2 = decksRef.child(path);
    var ref1 = ref2.child(id+'/children');

    var ref = Firebase.util.intersection(
      { ref: ref1, keyMap: {'.value': 'name2'} } ,
      { ref: ref2, keyMap: ['name'] } );

    return $firebase(ref);
  };

}]);

// TODO: Create a decks api?
