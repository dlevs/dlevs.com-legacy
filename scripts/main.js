require('lazysizes');
var instantclick = require('instantclick');
var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI_Default = require('photoswipe/dist/photoswipe-ui-default.js');

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


document.addEventListener('DOMContentLoaded', instantclick.init);
document.addEventListener('DOMContentLoaded', function () {
	function getImageDimensions(filepath) {
		var match = /_(\d+)x(\d+)\./.exec(filepath);

		console.log(match)

		return {
			width: Number(match[1]),
			height: Number(match[2])
		}
	}

	var pswpElement = document.querySelector('.pswp');
	var elems = Array.prototype.slice.call(
		document.querySelectorAll('.js-photoswipe')
	);

	var items = elems.map(function (elem) {
		var dimensions = getImageDimensions(elem.href);

		return {
			src: elem.href,
			w: dimensions.width,
			h: dimensions.height
		}

	});

	document.addEventListener('click', function (e) {
		var imgLink = e.target.closest('.js-photoswipe');

		if (!imgLink) return;

		e.preventDefault();

		var options = {index: elems.indexOf(imgLink) || 0};

// Initializes and opens PhotoSwipe
		var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	});

});
