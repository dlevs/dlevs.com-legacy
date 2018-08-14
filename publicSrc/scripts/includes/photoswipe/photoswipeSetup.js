import PhotoSwipe from '@dlevs/photoswipe';
import queryString from 'query-string';
import PhotoSwipeUI from './photoswipeUi';
import { $, getLastInputDevice, focusWithoutScrolling } from '../utils';
import {
	trackGalleryOpen,
	trackGalleryNavigation,
	trackShare,
} from '../googleAnalytics';

const SLIDE_SELECTOR = '.js-photoswipe';

/**
 * Get the link elements that wrap the thumbnail images of a gallery.
 *
 * @returns {HTMLAnchorElement[]}
 */
const getSlides = () => $(SLIDE_SELECTOR);

/**
 * Get the `options.items` value expected by PhotoSwipe from an
 * array of thumbnail links.
 *
 * @param {HTMLAnchorElement[]} slides
 */
const getGalleryItems = (slides) => {
	// Check first thumbnail format. First image is unlikely to be
	// lazyloaded, so will be populated with webp/ jpg, instead of
	// placeholder data gif src.
	const firstThumbnail = slides[0].getElementsByTagName('img')[0];
	const isWebp = /\.webp$/.test(firstThumbnail.currentSrc);

	return slides.map((elem, i) => {
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
};

/**
 * For accessibility, add text to link titles to indicate that clicking
 * will open the gallery.
 *
 * @param {HTMLAnchorElement[]} slides
 */
const applyTitlesToSlides = (slides) => {
	slides.forEach((link) => {
		const textToAppend = 'View in gallery (opens dialog)';

		// eslint-disable-next-line no-param-reassign
		link.title = link.title
			? `${link.title} - ${textToAppend}`
			: textToAppend;
	});
};

/**
 * Make all thumbnails visible.
 *
 * @param {Object} gallery
 */
const showAllThumbnails = (gallery) => {
	gallery.items.forEach(({ thumbnail }) => {
		thumbnail.closest(SLIDE_SELECTOR).classList.remove('invisible');
	});
};

/**
 * Make the current active thumbnail invisible.
 *
 * This is useful to prevent 2 images from showing on opening/closing the gallery:
 * - The original thumbnail
 * - The gallery image which expands/shrinks over the thumbnail
 *
 * By hiding the first of these, it creates the effect of a single image expanding/shrinking.
 *
 * @param {Object} gallery
 */
const hideActiveThumbnail = (gallery) => {
	showAllThumbnails(gallery);
	gallery.currItem.thumbnail.closest(SLIDE_SELECTOR).classList.add('invisible');
};

/**
 * Apply tracking events to a new gallery.
 *
 * @param {Object} gallery
 */
const applyGalleryTracking = (gallery) => {
	console.log(gallery.currItem.pid, gallery.currItem.title);
	trackGalleryOpen({
		title: gallery.currItem.title,
		index: gallery.currItem.pid,
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
};

/**
 * Get the default options for a PhotoSwipe gallery
 *
 * The gallery is not initialized at the point where this function is
 * expected to be called, but some of the callback functions defined
 * in the options require it. This is provided via the `getGallery`
 * parameter.
 *
 * @param {Function<Object>} getGallery
 * @returns {Object}
 */
const getDefaultOptions = getGallery => ({
	index: 0,
	getThumbBoundsFn: (currentIndex) => {
		const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
		const rect = getGallery().items[currentIndex].thumbnail.getBoundingClientRect();

		return {
			x: Math.round(rect.left),
			y: Math.round(rect.top + pageYScroll),
			w: Math.round(rect.width),
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
	getPageURLForShare() {
		const {
			protocol, host, pathname, search, hash,
		} = window.location;
		const newSearch = queryString.stringify({
			...queryString.parse(search),
			pid: getGallery().currItem.pid,
		});

		// Appends the "pid" value to the query string, so it can
		// be used on backend to set the sharing image.
		return `${protocol}//${host}${pathname}?${newSearch}${hash}`;
	},
});

/**
 * Create an instance of PhotoSwipe and immediately open it.
 *
 * @param {Object} userOptions
 */
const openGallery = (userOptions) => {
	const focusedElementBeforeOpening = document.activeElement;
	const items = getGalleryItems(getSlides());
	const options = {
		// eslint-disable-next-line no-use-before-define
		...getDefaultOptions(() => gallery),
		...userOptions,
	};
	const gallery = new PhotoSwipe(
		document.querySelector('.pswp'),
		PhotoSwipeUI,
		items,
		options,
	);
	let isInitialSlide = true;

	gallery.listen('imageLoadComplete', (index) => {
		// Image load complete for the placeholder that expands over thumbnail.
		// Make the thumbnail below invisible so the element appears to move.
		if (isInitialSlide && index === options.index) {
			hideActiveThumbnail(gallery);
			isInitialSlide = false;
		}
	});
	gallery.listen('beforeChange', () => {
		// Make thumbnail for current slide invisible.
		// Must omit on PhotoSwipe init as expanding placeholder may not yet be loaded.
		if (!isInitialSlide) {
			hideActiveThumbnail(gallery);
		}
	});
	gallery.listen('destroy', () => {
		showAllThumbnails(gallery);
		// Refocus last element on gallery close for accessibility
		if (getLastInputDevice() === 'keyboard') {
			focusWithoutScrolling(focusedElementBeforeOpening);
		}
	});

	gallery.init();
	applyGalleryTracking(gallery);
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
const onThumbnailClick = (event) => {
	const imgLink = event.target.closest(SLIDE_SELECTOR);

	if (!imgLink) return;

	event.preventDefault();

	const index = getSlides().indexOf(imgLink);

	openGallery({ index });
};

/**
 * If there are relevant parameters in the current URL's hash,
 * open the gallery at the defined index.
 */
const openGalleryFromHash = () => {
	const { pid } = queryString.parse(window.location.hash);

	if (pid === undefined) return;

	openGallery({
		index: Number(pid) - 1,
		showAnimationDuration: 0,
	});
};

const init = () => {
	document.addEventListener('click', onThumbnailClick);
	openGalleryFromHash();
	applyTitlesToSlides(getSlides());
};

export default init;
