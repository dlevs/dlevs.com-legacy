/*
 * This module fetches pages when hovering over internal links. Since
 * the site has only static content, pages can get away with having a
 * non-zero maxage Cache-Control directive. For example, 60 seconds.
 *
 * The cached page will load quicker if the user decides to click.
 */

import { fetch, hasExtension, wasRecentlyTouched } from './utils';

const init = () => {
	let lastLink;

	document.addEventListener('mouseover', ({ target }) => {
		if (wasRecentlyTouched()) return;

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

		// eslint-disable-next-line compat/compat
		fetch(link.href);
	});
};

export default init;
