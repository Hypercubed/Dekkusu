"use strict";

angular.module('mainApp').service('deckManager', ['FBURL', '$firebase', function(FBURL, $firebase) {
	var baseRef = new Firebase(FBURL);
  var decksRef = baseRef.child('decks');
  var usersRef = baseRef.child('sets');

    this.getUserDeckIds = function(username) {
    	var ref = usersRef.child(username).child('decks');
    	return $firebase(ref);
    };

    this.getDeckById = function(id) {
      var cardRef = decksRef.child(id).child('cards');
      return $firebase(cardRef);
    }

    this.addDeck = function(username) {
      var d = decksRef.push();
      d.set({ owner: username });
      usersRef.child(username).child('decks').child(d.name()).set(true);
    };

    this.removeDeck = function(username, id) {
      decksRef.child(id).remove();
      usersRef.child(username).child('decks').child(id).remove();
    };


}]);
