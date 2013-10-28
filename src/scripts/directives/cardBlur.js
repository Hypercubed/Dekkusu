'use strict';

/**
 * Directive that executes an expression when the element it is applied to loses focus
 */
app.directive('cardBlur', function () {
	return function (scope, elem, attrs) {
		elem.bind('blur', function (e) {
			if (!e.relatedTarget) {
				scope.$apply(attrs.cardBlur);
			}
		});
	};
});