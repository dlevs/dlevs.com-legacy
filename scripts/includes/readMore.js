var instantclick = require('instantclick');

var READMORE_MAX_WIDTH = 500;
var SELECTOR = '[data-readmore-summary]';

function init() {
	if (window.innerWidth > READMORE_MAX_WIDTH) return;

	var elems = Array.prototype.slice.call(
		document.querySelectorAll(SELECTOR)
	);

	elems.forEach(function (elem) {
		var button = '<p><button>Read more...</button></p>';
		elem.dataset.readmoreFull = elem.innerHTML;
		elem.innerHTML = elem.dataset.readmoreSummary + button;
	});
}

function showMore(event) {
	var wrapper = event.target.closest(SELECTOR);
	if (wrapper && wrapper.dataset.readmoreFull) {
		wrapper.innerHTML = wrapper.dataset.readmoreFull;
	}
}

module.exports = {
	init: function () {
		init();
		document.addEventListener('click', showMore, false);
		instantclick.on('change', init);
	}
};
