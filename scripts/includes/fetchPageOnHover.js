/*
 * This module fetches pages when hovering over internal links. Since
 * the site has only static content, pages can get away with having a
 * non-zero maxage Cache-Control directive. For example, 10 seconds.
 *
 * The cached page will load quicker if the user decides to click.
 */

const hasExtension = pathname => /\.[^/.]+$/.test(pathname);

const init = () => {
	let lastLink;

	document.addEventListener('mouseover', ({ target }) => {
		const link = target.closest('a');

		if (link === lastLink) {
			return;
		}

		if (
			// Element is not a link, and no ancestor link found
			!link ||
			// Link is not internal
			link.hostname !== window.location.hostname ||
			// Link is not for a html document
			hasExtension(link.pathname)
		) {
			lastLink = null;
			return;
		}

		lastLink = link;

		// TODO: Check this is polyfilled and working for IE9
		window.fetch(link.href, {
			credentials: 'same-origin',
		});
	});
};

export default init;
