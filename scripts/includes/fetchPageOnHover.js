/*
 * This module fetches pages when hovering over internal links. Since
 * the site has only static content, pages can get away with having a
 * non-zero maxage Cache-Control directive. For example, 60 seconds.
 *
 * The cached page will load quicker if the user decides to click.
 */

const { fetchAndForget, hasExtension } = require('./utils');

const init = () => {
	let lastLink;
	let wasTouched = false;

	document.addEventListener('mouseover', ({ target }) => {
		if (wasTouched) return;

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

		fetchAndForget(link.href);
	});

	// Touch devices register touchstart and mouseover almost
	// immediately after eachother. There's no need to fetch anything.
	document.addEventListener('touchstart', () => {
		wasTouched = true;
		setTimeout(() => {
			wasTouched = false;
		}, 100);
	});
};

export default init;
