"use strict";

/* angular.module('mainApp').factory('deckFactory', ['FBURL', '$firebase', function(FBURL, $firebase) {
  var decksRef = new Firebase(FBURL).child('decks');

  function _getDeck(path,id) {
    var id = id || 'root';
    var ref = decksRef.child(path+'/'+id);
    return $firebase(ref);
  }

  function _getChildren(path,id) {
    var id = id || 'root';

    var ref2 = decksRef.child(path);
    var ref1 = ref2.child(id+'/children');

    var ref = Firebase.util.intersection(
      {ref: ref1, keyMap: {'.value': 'name2'} } ,
      ref2 );

    return $firebase(ref);
  };

  return function(path,id) {
    var Deck = _getDeck(path,id);

    Deck.$getChildren = function() {
      Deck.$children = _getChildren(path,id);
      return Deck.$children;
    }

    return Deck;
  }

}]); */

angular.module('mainApp').service('deckManager', ['FBURL', '$firebase', '$rootScope',function(FBURL, $firebase,$rootScope) {  // TODO: create provider?
  var self = this;

	var baseRef = new Firebase(FBURL);
  var decksRef = baseRef.child('decks');  // Change this to deck sets?

  $rootScope.$on("userAuth:data_loaded", function(evt, userData) {
    console.log('userAuth:data_loaded', 'deckManager', userData);

    var rootDeck = self.getDeck(userData.deck);   // Todo: check if deck name is unique
    rootDeck.image_url = 'http://www.gravatar.com/avatar/'+userData.gravatar_id+'?s=50&d=retro';
    //rootDeck.owner = user.uid;
    rootDeck.name = rootDeck.name || userData.username;
    rootDeck.$save();

  });


  //this.getDeckIds = function(path,id) {
  //  var id = id || 'root';
  //  return $firebase(decksRef.child(path+'/'+id+'/children'));
  //}

  this.getDeck = function(path,id) {  // Todo: don't resolve until children are loaded
    var id = id || 'root';
    var ref = decksRef.child(path+'/'+id);
    var fb = $firebase(ref);
    fb.$children = self.getChildren(path,id);
    return fb;
  }

  this.getChildren = function(path,id) {
    var id = id || 'root';

    var ref2 = decksRef.child(path);
    var ref1 = ref2.child(id+'/children');

    var ref = Firebase.util.intersection(
      { ref: ref1, keyMap: {'.value': 'name2'} } ,
      { ref: ref2, keyMap: ['name'] } );

    return $firebase(ref);
  };

  //this.getImageUrl = function(path) {
  //  var ref = decksRef.child(path+'/image_url');
  //  return $firebase(ref);
  //}

    //this.getCardsByDeckId = function(id) {
    //  var cardRef = decksRef.child(id).child('cards');
    //  return $firebase(cardRef);
    //}

    /* this.addDeck = function(path, parent, deck) {
      var parent = parent || 'root';
      var deck = deck || { name: 'new' };

      var id = decksRef.child(path).push(deck).name();
      decksRef.child(path+'/'+parent+'/children/'+id).set(deck.name);
    };

    this.removeDeck = function(path, parent, id) {  // Need to delete all children
      var parent = parent || 'root';

      decksRef.child(path+'/'+id).remove();
      decksRef.child(path+'/'+parent+'/children/'+id).remove();
    }; */

}]);

// TODO: Create a decks api?
