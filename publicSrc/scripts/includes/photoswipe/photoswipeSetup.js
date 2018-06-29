import PhotoSwipe from '@dlevs/photoswipe';
import queryString from 'query-string';
import PhotoSwipeUI from './photoswipeUi';
import { getLastInputDevice, focusWithoutScrolling } from '../utils';
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
	const items = elems.map((elem, i) => {
		const thumbnail = elem.getElementsByTagName('img')[0];
		const caption = elem.getElementsByTagName('figcaption')[0];

		return {
			pid: i + 1,
			src: isWebp ? elem.getAttribute('data-href-webp') : elem.href,
			msrc: thumbnail.currentSrc || thumbnail.src,
			thumbnail,
			w: Number(elem.getAttribute('data-width')),
			h: Number(elem.getAttribute('data-height')),
			mapLink: elem.getAttribute('data-map-link'),
			title: elem.getAttribute('data-caption') || (caption && caption.textContent),
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
		getPageURLForShare: () => {
			const {
				protocol, host, pathname, search, hash,
			} = window.location;
			const newSearch = queryString.stringify({
				...queryString.parse(search),
				// eslint-disable-next-line no-use-before-define
				pid: gallery.currItem.pid,
			});

			// Appends the "pid" value to the query string, so it can
			// be used on backend to set the sharing image.
			return `${protocol}//${host}${pathname}?${newSearch}${hash}`;
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
			index: gallery.currItem.pid,
		});
	});
	gallery.listen('shareLinkClick', (e, target) => {
		trackShare({
			content_type: 'image',
			method: target.getAttribute('data-method'),
			title: gallery.currItem.title,
		});
	});

	// Refocus last element on gallery close for accessibility
	gallery.listen('close', () => {
		if (getLastInputDevice() === 'keyboard') {
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
	const { pid } = queryString.parse(window.location.hash);

	if (pid === undefined) return;

	openGallery(Number(pid) - 1, true);
};

const applyTitlesToLinks = () => {
	getSlideElements().forEach((link) => {
		const textToAppend = 'View in gallery (opens dialog)';

		// eslint-disable-next-line no-param-reassign
		link.title = link.title
			? `${link.title} - ${textToAppend}`
			: textToAppend;
	});
};

const init = () => {
	document.addEventListener('click', onImageLinkClick);
	openGalleryFromHash();
	applyTitlesToLinks();
};

export default init;
