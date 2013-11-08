/*global describe, it, LiveReload */
'use strict';
(function () {

  describe('Controller: CardCtrl', function () {

    beforeEach(module('mainApp'));

    var $httpBackend, $rootScope, createController;

    var defaultCards = [
      {"text":"ジョンは 先生{[せんせい]}に しかられた。\n\n{John was scolded by the teacher.}"},
      {"text":"先生[{せんせい}]はジョンを しかった。\n\n{The teacher scolded John.}"}
    ];

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');

      $httpBackend
        .expectGET('data/first30.txt')
        .respond("ジョンは 先生{[せんせい]}に しかられた。\\n\\n{John was scolded by the teacher.}\n先生[{せんせい}]はジョンを しかった。\\n\\n{The teacher scolded John.}");

      $rootScope = $injector.get('$rootScope');

      var $controller = $injector.get('$controller');

      var cardStorage = {
        cards: defaultCards,
        getCards: function() { return this.cards; },
        saveCards: function(cards) { this.cards = cards; }
      };

      createController = function() {
        return $controller('CardCtrl', {'$scope': $rootScope, cardStorage: cardStorage});
      };

    }));

    afterEach(function() {
      //$httpBackend.verifyNoOutstandingExpectations();
      //$httpBackend.verifyNoOutstandingRequests();
    });

    it('should load from cardStorage', function() {

      createController('CardCtrl');

      expect($rootScope.cards).to.equal(defaultCards);

    });

    it('should clear', function() {

      createController('CardCtrl');

      $rootScope.clear();
      expect($rootScope.cards).to.deep.equal([]);
    });

    it('should reset', function() {

      createController('CardCtrl');

      $rootScope.reset();
      $httpBackend.flush();

      expect($rootScope.cards).to.be.a('array');
      expect($rootScope.cards).to.have.length(2);
      //expect($rootScope.cards).to.equal(defaultCards);

    });



  });

})();
