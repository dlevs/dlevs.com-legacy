var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI = require('./photoswipe-ui');

function getSlideElements() {
	return Array.prototype.slice.call(
		document.querySelectorAll('.js-photoswipe')
	);
}

function openGallery(index, disableTransitions) {
	var pswpElement = document.querySelector('.pswp');
	var elems = getSlideElements();
	// Check first thumbnail format. First image is unlikely to be
	// lazyloaded, so will be populated with webp/ jpg, instead of
	// placeholder data gif src.
	var firstThumbnail = elems[0].getElementsByTagName('img')[0];
	var isWebp = /\.webp$/.test(firstThumbnail.currentSrc);
	var items = elems.map(function (elem) {
		var thumbnail = elem.getElementsByTagName('img')[0];
		var caption = elem.getElementsByTagName('figcaption')[0];

		return {
			src: isWebp ? elem.dataset.hrefWebp : elem.href,
			msrc: thumbnail.currentSrc || thumbnail.src,
			thumbnail: thumbnail,
			w: Number(elem.dataset.width),
			h: Number(elem.dataset.height),
			mapLink: elem.dataset.mapLink,
			title: elem.dataset.caption || (caption && caption.textContent)
		}
	});
	var options = {
		index: index,
		getThumbBoundsFn: function (index) {
			var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			var rect = items[index].thumbnail.getBoundingClientRect();

			return {
				x: rect.left,
				y: rect.top + pageYScroll,
				w: rect.width
			};
		},
		getDoubleTapZoom: function () {
			var scale = 1 / (window.devicePixelRatio || 1);
			var minScale = 0.5;
			return Math.max(minScale, scale);
		}
	};

	if (disableTransitions) {
		options.hideAnimationDuration = 0;
		options.showAnimationDuration = 0;
	}

	var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, items, options);

	gallery.init();
}

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
function onImageLinkClick(event) {
	var imgLink = event.target.closest('.js-photoswipe');

	if (!imgLink) return;

	event.preventDefault();

	var elems = getSlideElements();
	var index = elems.indexOf(imgLink);

	openGallery(index);
}

function openGalleryFromHash() {
	var matches = /pid=(\d+)/.exec(location.hash);

	if (!matches) return;

	var index = Number(matches[1]) - 1;

	openGallery(index, true);
}


function init() {
	document.addEventListener('click', onImageLinkClick);
	openGalleryFromHash();
}

module.exports = {init: init};
