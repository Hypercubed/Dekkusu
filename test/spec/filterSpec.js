/*global describe, it, LiveReload */
'use strict';
(function () {

  describe('Testing filters', function () {

    beforeEach(module('mainApp'));

    var $filter;

    beforeEach(inject(function($injector) {
      $filter = $injector.get('$filter');
    }));

    describe('formatCard filter', function () {
      var filter;

      it('should find the formatCard filter', function() {
        filter = $filter('formatCard');
        expect(filter).to.be.a('function');
      });

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
      var filter;

      it('should find the status filter', function() {
        filter = $filter('status');
        expect(filter).to.be.a('function');
      });

      it('should return correct values', function() {
        expect(filter(null)).to.equal(-1);              //
        expect(filter({})).to.equal(0);                 // new
        expect(filter({last: null})).to.equal(0);       // new
        expect(filter({last: 0, due: 0})).to.equal(1);  // due
        expect(filter({last: 0})).to.equal(2);          // done
      });

    });

  });

})();
