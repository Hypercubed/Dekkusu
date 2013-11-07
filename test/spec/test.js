/*global describe, it, LiveReload */
'use strict';
(function () {

  describe('Testing mainApp', function () {

    beforeEach(module('mainApp'));

    describe('Testing filters', function () {

      describe('formatCard filter', function () {
        var filter = null;

        it('should find the formatCard filter', inject(function($filter) {
          filter = $filter('formatCard');
          expect(filter).to.be.a('function');
        }));

        it('should return correct text', function() {

          expect(filter('Hello')).to.equal('<p>Hello</p>');

          // Markdown
          expect(filter('*Hello*')).to.equal('<p><em>Hello</em></p>');
          expect(filter('**Hello**')).to.equal('<p><strong>Hello</strong></p>');
          expect(filter('`Hello`')).to.equal('<p><code>Hello</code></p>');
          //expect(filter('[Hello](http://world.com/ "World")')).to.equal('<p><a href="http://world.com/" title="World">Hello</a></p>');

          // Cloze
          expect(filter('Hello {world}')).to.equal('<p>Hello <span class="cloze">world</span></p>');
          expect(filter('Hello {{world}}')).to.equal('<p>Hello [<span class="cloze">world</span><span class="uncloze">...</span>]</p>');
          expect(filter('Hello {world::earth}')).to.equal('<p>Hello <span class="cloze">world</span><span class="uncloze">earth</span></p>');
          expect(filter('Hello {{world::earth}}')).to.equal('<p>Hello [<span class="cloze">world</span><span class="uncloze">earth</span>]</p>');

          // Todo
          //expect(filter('Hello {world::}')).to.equal('<p>Hello <span class="cloze">world</span><span class="uncloze">...</span></p>');

          // Ruby text
          expect(filter('Hello[world]')).to.equal('<p><ruby>Hello<rp>[</rp><rt>world</rt><rp>]</rp></ruby></p>');

          // Nesting
          //expect(filter('Hello \\[{world::earth}\\]')).to.equal('<p>Hello [<span class="cloze">world</span><span class="uncloze">earth</span>]</p>');
          //expect(filter('Hello [{world::earth}]')).to.equal('<p>Hello [<span class="cloze">world</span><span class="uncloze">earth</span>]</p>');
          expect(filter('Hello {[world::earth]}')).to.equal('<p>Hello <ruby><rp>[</rp><rt><span class="cloze">world</span><span class="uncloze">earth</span></rt><rp>]</rp></ruby></p>');

        });

      });

      describe('status filter', function () {
        var filter = null;

        it('should find the status filter', inject(function($filter) {
          filter = $filter('status');
          expect(filter).to.be.a('function');
        }));

        it('should return correct values', function() {
          expect(filter(null)).to.equal(-1);              //
          expect(filter({})).to.equal(0);                 // new
          expect(filter({last: null})).to.equal(0);       // new
          expect(filter({last: 0, due: 0})).to.equal(1);  // due
          expect(filter({last: 0})).to.equal(2);          // done
        });

      });

    });

    describe('Testing controllers', function () {

      var $httpBackend, $rootScope, createController;

      beforeEach(inject(function($injector) {
         // Set up the mock http service responses
         $httpBackend = $injector.get('$httpBackend');
         // backend definition common for all tests
         $httpBackend.whenGET('data/first30.txt').respond(["sdfsdf","sdfsdf"]);

         // Get hold of a scope (i.e. the root scope)
         $rootScope = $injector.get('$rootScope');
         // The $controller service is used to create instances of controllers
         var $controller = $injector.get('$controller');

         createController = function() {
           return $controller('CardCtrl', {'$scope' : $rootScope });
         };
       }));

      describe('CardCtrl', function () {
        it('should reset and clear', function() {
          $httpBackend.expectGET('data/first30.txt').respond("Hello world\nHello world");

          createController();


          $rootScope.reset();
          $httpBackend.flush();

          expect($rootScope.cards).to.be.a('array');
          expect($rootScope.cards.length).to.equal(2);

          $rootScope.clear();
          expect($rootScope.cards).to.be.a('array');
          expect($rootScope.cards.length).to.equal(0);
        });
      });
    });

  });

})();
