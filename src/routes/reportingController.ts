import { Context } from 'koa';

export default () => ({
	/**
	 * Report Content Security Policy violations.
	 */
	reportCSPViolation: (ctx: Context) => {
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
