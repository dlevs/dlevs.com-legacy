var instantclick = require('instantclick');

function init() {
	var READMORE_MAX_WIDTH = 500;
	var SELECTOR = '[data-readmore-summary]';

	function $(selector) {
		var elems = document.querySelectorAll(selector);
		return Array.prototype.slice.call(elems);
	}

	function initReadmore() {
		if (window.innerWidth > READMORE_MAX_WIDTH) {
			return;
		}

		$(SELECTOR).forEach(function (elem) {
			var button = '<p><button>Read more...</button></p>';
			elem.dataset.readmoreFull = elem.innerHTML;
			elem.innerHTML = elem.dataset.readmoreSummary + button;
		});
	}

	document.addEventListener('click', function (event) {
		var wrapper = event.target.closest(SELECTOR);
		if (wrapper && wrapper.dataset.readmoreFull) {
			wrapper.innerHTML = wrapper.dataset.readmoreFull;
		}
	}, false);

	instantclick.on('change', function() {
		initReadmore();
	});

	initReadmore();
}

module.exports = {init: init};
