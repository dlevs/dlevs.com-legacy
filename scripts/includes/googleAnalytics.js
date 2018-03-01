/* eslint-disable camelcase */

import instantclick from './vendor/instantclick';

const { GOOGLE_ANALYTICS_ID, BASE_CONFIG, gtag } = window;

export const trackPageView = () => {
	const { pathname, search } = document.location;

	gtag('config', GOOGLE_ANALYTICS_ID, {
		...BASE_CONFIG,
		page_path: pathname + search,
	});
};

export const trackException = ({
	message, filename, lineno, colno,
}) =>
	gtag('event', 'exception', {
		description: message,
		file: `${filename} ${lineno}:${colno}`,
	});

const trackGalleryEvent = ({ title, index, event_label }) =>
	gtag('event', 'gallery_view', {
		event_category: 'engagement',
		title,
		index,
		event_label,
	});

export const trackGalleryOpen = data =>
	trackGalleryEvent({ ...data, event_label: 'open' });

export const trackGalleryNavigation = data =>
	trackGalleryEvent({ ...data, event_label: 'navigation' });

export const trackShare = ({ content_type, method, title }) => {
	const { pathname, search, hash } = document.location;

	gtag('event', 'share', {
		content_id: pathname + search + hash,
		event_action: 'share_url',
		content_type,
		method,
		title,
	});
};

const init = () => {
	window.addEventListener('error', trackException);
	instantclick.on('change', (isInitialLoad) => {
		if (!isInitialLoad) {
			trackPageView();
		}
	});
};

export default init;
