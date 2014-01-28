"use strict";

angular.module('mainApp').service('deckManager', ['FBURL', '$firebase', function(FBURL, $firebase) {  // TODO: create provider
  var self = this;

	var baseRef = new Firebase(FBURL);
  var decksRef = baseRef.child('decks');

  this.getDeckIds = function(path,id) {
    var id = id || 'root';
    return $firebase(decksRef.child(path+'/'+id+'/children'));
  }

    //this.getCardsByDeckId = function(id) {
    //  var cardRef = decksRef.child(id).child('cards');
    //  return $firebase(cardRef);
    //}

    this.addDeck = function(path, parent, deck) {
      var parent = parent || 'root';
      var deck = deck || { name: 'new' };

      var id = decksRef.child(path).push(deck).name();
      decksRef.child(path+'/'+parent+'/children/'+id).set(deck.name);
    };

    this.removeDeck = function(path, parent, id) {  // Need to delete all children
      var parent = parent || 'root';

      decksRef.child(path+'/'+id).remove();
      decksRef.child(path+'/'+parent+'/children/'+id).remove();
    };


}]);

// TODO: Create a decks api?
