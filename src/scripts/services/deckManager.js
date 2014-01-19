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
      var cardRef = decksRef.child(id);
      return $firebase(cardRef);
    }

    this.getCardsByDeckId = function(id) {
      var cardRef = decksRef.child(id).child('cards');
      return $firebase(cardRef);
    }

    this.addDeck = function(username, deck) {
      var deck = deck || { owner: username };

      var d = decksRef.push();
      deck.name = deck.name || d.name().substr(d.name().length-4);
      d.set(deck);
      usersRef.child(username).child('decks').child(d.name()).set(deck.name);
    };

    this.removeDeck = function(username, id) {
      decksRef.child(id).remove();
      usersRef.child(username).child('decks').child(id).remove();
    };


}]);
