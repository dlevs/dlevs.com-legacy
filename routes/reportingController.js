'use strict';

module.exports = () => ({
	/**
	 * Report Content Security Policy violations.
	 *
	 * @param {Object} ctx
	 */
	reportCSPViolation: (ctx) => {
		if (ctx.request.body) {
			// eslint-disable-next-line no-console
			console.error('CSP Violation: ', ctx.request.body);
		} else {
			// eslint-disable-next-line no-console
			console.error('CSP Violation: No data received!');
		}
		ctx.status = 204;
	},
});
