module.exports = (ctx, next) => {
	// Properties of ctx.state are available as a globals in pug templates.
	ctx.state = ctx.state || {};
	ctx.state.CTX = ctx;
	ctx.state.COUNTER = 0;
	return next();
};
