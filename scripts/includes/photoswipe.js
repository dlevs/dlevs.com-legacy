var PhotoSwipe = require('photoswipe');
var PhotoSwipeDefaultUI = require('photoswipe/dist/photoswipe-ui-default.js');

/**
 * Opens the photoswipe gallery when clicking a link with the "js-photoswipe"
 * class. All images with class "js-photoswipe: are included in the gallery.
 *
 * Link should have href for larger version of the image that it wraps.
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

	var pswpElement = document.querySelector('.pswp');
	var elems = Array.prototype.slice.call(
		document.querySelectorAll('.js-photoswipe')
	);
	var items = elems.map(function (elem) {
		var thumbnail = elem.getElementsByTagName('img')[0];
		return {
			src: elem.href,
			msrc: thumbnail.src,
			thumbnail: thumbnail,
			w: Number(elem.dataset.width),
			h: Number(elem.dataset.height)
		}
	});
	var options = {
		index: elems.indexOf(imgLink),
		getThumbBoundsFn: function (index) {
			var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			var rect = items[index].thumbnail.getBoundingClientRect();

			return {
				x: rect.left,
				y: rect.top + pageYScroll,
				w: rect.width
			};
		}
	};
	var gallery = new PhotoSwipe(pswpElement, PhotoSwipeDefaultUI, items, options);

	gallery.init();
}


function init() {
	document.addEventListener('click', onImageLinkClick);
}

module.exports = {init: init};
