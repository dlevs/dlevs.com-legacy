import instantclick from 'instantclick';

export const init = () => {
	window.addEventListener('error', (e) => {
		gtag('event', 'exception', {
			description: e.message,
			file: e.filename + ' ' + e.lineno + ':' + e.colno
		});
	});

	instantclick.on('change', () => {
		gtag('config', window.GOOGLE_ANALYTICS_ID, {
			page_path: location.pathname + location.search
		});
	});
};
