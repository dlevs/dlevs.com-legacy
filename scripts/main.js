// Element.prototype.closest polyfill
// https://github.com/jonathantneal/closest/blob/master/element-closest.js
(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
				var element = this;
				var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
				var index = 0;

				while (elements[index] && elements[index] !== element) {
					++index;
				}

				return Boolean(elements[index]);
			};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);
(function () {
	var READMORE_MAX_WIDTH = 500;

	function $(selector) {
		var elems = document.querySelectorAll(selector);
		return Array.prototype.slice.call(elems);
	}

	function initReadmore() {
		var SELECTOR = '[data-readmore-summary]';

		document.addEventListener('DOMContentLoaded', function () {
			$(SELECTOR).forEach(function (elem) {
				var button = '<p><button>Read more...</button></p>';
				elem.dataset.readmoreFull = elem.innerHTML;
				elem.innerHTML = elem.dataset.readmoreSummary + button;
			});
		});

		document.addEventListener('click', function (event) {
			var wrapper = event.target.closest(SELECTOR);
			if (wrapper && wrapper.dataset.readmoreFull) {
				wrapper.innerHTML = wrapper.dataset.readmoreFull;
			}
		}, false);
	}

	if (window.innerWidth <= READMORE_MAX_WIDTH) {
		initReadmore();
	}
})();

