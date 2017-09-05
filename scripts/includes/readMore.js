function init() {
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
}

module.exports = {init: init};
