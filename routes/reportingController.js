module.exports = () => ({
	/**
	 * Report Content Security Policy violations.
	 *
	 * @param {Object} ctx
	 */
	reportCSPViolation: (ctx) => {
		if (ctx.request.body) {
			console.error('CSP Violation: ', ctx.request.body)
		} else {
			console.error('CSP Violation: No data received!')
		}
		ctx.status = 204;
	}
});
