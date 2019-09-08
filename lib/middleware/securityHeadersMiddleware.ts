'use strict';

import helmet from 'koa-helmet';

export default helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: [
				"'self'",
				// It would be nice to block inline scripts / styles, but
				// it's more likely to introduce bugs than prevent a real
				// XSS threat on this site.
				"'unsafe-inline'",
				// Analytics scripts
				'https://www.googletagmanager.com',
				'https://www.google-analytics.com',
			],
			styleSrc: [
				"'self'",
				"'unsafe-inline'",
				'blob:',
			],
			imgSrc: [
				"'self'",
				'data:',
				// Analytics scripts
				'https://www.google-analytics.com',
			],
			reportUri: '/report-csp-violation',
		},
		// Requests are cached. Don't base anything off browser.
		browserSniff: false,
	},
	referrerPolicy: { policy: 'same-origin' },
});
