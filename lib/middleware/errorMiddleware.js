const { STATUS_CODES } = require('http');

module.exports = async (ctx, next) => {
	try {
		await next();
		const status = ctx.status || 404;
		if (status === 404) {
			ctx.throw(404);
		}
	} catch (err) {
		ctx.status = err.status || 500;

		await ctx.render('error', {
			status: ctx.status,
			message: STATUS_CODES[ctx.status],
			error: err,
		});

		// Emit the error so it logs to console
		ctx.app.emit('error', err, ctx);
	}
};
