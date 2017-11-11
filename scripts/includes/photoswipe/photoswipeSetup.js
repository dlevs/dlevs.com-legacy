import keycode from 'keycode';
import PhotoSwipe from '@dlevs/photoswipe';
import PhotoSwipeUI from './photoswipeUi';
import { getLastKeyCode, getLastInputDevice, focusWithoutScrolling } from '../utils';
import {
	trackGalleryOpen,
	trackGalleryNavigation,
	trackShare,
} from '../googleAnalytics';

const getSlideElements = () => Array.prototype.slice.call(document.querySelectorAll('.js-photoswipe'));

const openGallery = (index, disableTransitions) => {
	const focusedElementBeforeOpening = document.activeElement;
	const pswpElement = document.querySelector('.pswp');
	const elems = getSlideElements();
	// Check first thumbnail format. First image is unlikely to be
	// lazyloaded, so will be populated with webp/ jpg, instead of
	// placeholder data gif src.
	const firstThumbnail = elems[0].getElementsByTagName('img')[0];
	const isWebp = /\.webp$/.test(firstThumbnail.currentSrc);
	const items = elems.map((elem) => {
		const thumbnail = elem.getElementsByTagName('img')[0];
		const caption = elem.getElementsByTagName('figcaption')[0];

		return {
			src: isWebp ? elem.dataset.hrefWebp : elem.href,
			msrc: thumbnail.currentSrc || thumbnail.src,
			thumbnail,
			w: Number(elem.dataset.width),
			h: Number(elem.dataset.height),
			mapLink: elem.dataset.mapLink,
			title: elem.dataset.caption || (caption && caption.textContent),
		};
	});
	const options = {
		index,
		getThumbBoundsFn: (currentIndex) => {
			const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			const rect = items[currentIndex].thumbnail.getBoundingClientRect();

			return {
				x: rect.left,
				y: rect.top + pageYScroll,
				w: rect.width,
			};
		},
		getDoubleTapZoom: (isMouseClick, item) => {
			const fullSizeScale = 1 / (window.devicePixelRatio || 1);

			// If screen has high pixel density, we don't want to shrink the
			// image on "zooming", so check this.
			return fullSizeScale < item.initialZoomLevel
				? item.initialZoomLevel * 1.5
				: fullSizeScale;
		},
	};

	if (disableTransitions) {
		options.hideAnimationDuration = 0;
		options.showAnimationDuration = 0;
	}

	const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, items, options);

	gallery.init();

	// Tracking
	trackGalleryOpen({
		title: items[index].title,
		index,
	});
	gallery.listen('afterChange', () => {
		trackGalleryNavigation({
			title: gallery.currItem.title,
			index: gallery.currItem.index,
		});
	});
	gallery.listen('shareLinkClick', (e, target) => {
		trackShare({
			content_type: 'image',
			method: target.dataset.method,
			title: gallery.currItem.title,
		});
	});

	// Refocus last element on gallery close for accessibility
	gallery.listen('close', () => {
		if (
			getLastInputDevice() === 'keyboard' &&
			getLastKeyCode() === keycode('esc')
		) {
			focusWithoutScrolling(focusedElementBeforeOpening);
		}
	});
};

/**
 * Opens the photoswipe gallery when clicking a link with the "js-photoswipe"
 * class. All images with class "js-photoswipe" are included in the gallery.
 *
 * The link should have a href for a larger version of the image that it wraps.
 *
 * e.g.
 * <a href="foo_large.jpg" class="js-photoswipe" data-width="1000" data-height="600">
 *     <img src="foo.jpg" alt="Foo" />
 * </a>
 *
 * @param {Object} event
 */
const onImageLinkClick = (event) => {
	const imgLink = event.target.closest('.js-photoswipe');

	if (!imgLink) return;

	event.preventDefault();

	const elems = getSlideElements();
	const index = elems.indexOf(imgLink);

	openGallery(index);
};

const openGalleryFromHash = () => {
	const matches = /pid=(\d+)/.exec(document.location.hash);

	if (!matches) return;

	const index = Number(matches[1]) - 1;

	openGallery(index, true);
};

const init = () => {
	document.addEventListener('click', onImageLinkClick);
	openGalleryFromHash();
};

export default init;
