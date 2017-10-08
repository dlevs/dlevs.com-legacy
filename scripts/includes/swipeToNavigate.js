import Hammer from 'hammerjs';
import instantclick from 'instantclick';

function canSwipe() {
	const isGalleryOpen = !!document.querySelector('.pswp--open');
	return !isGalleryOpen;
}

function registerEvents() {
	const hammer = new Hammer(document.body);
	hammer.on('swipe', function (e) {
		if (!canSwipe()) return;

		let link;

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

export const init = () => {
	registerEvents();
	instantclick.on('change', registerEvents);
};
