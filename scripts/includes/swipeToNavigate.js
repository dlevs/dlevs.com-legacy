var Hammer = require('hammerjs');
var instantclick = require('instantclick');

function canSwipe() {
	var isGalleryOpen = !!document.querySelector('.pswp--open');
	return !isGalleryOpen;
}

function init() {
	var hammer = new Hammer(document.body);
	hammer.on('swipe', function (e) {
		if (!canSwipe()) return;

		var link;

		if (e.direction === Hammer.DIRECTION_LEFT) {
			link = document.querySelector('.js-next-post-link');
		} else if (e.direction === Hammer.DIRECTION_RIGHT) {
			link = document.querySelector('.js-previous-post-link');
		}

		if (link) {
			link.click();
		}
	});
}

module.exports = {
	init: function () {
		init();
		instantclick.on('change', init);
	}
};
