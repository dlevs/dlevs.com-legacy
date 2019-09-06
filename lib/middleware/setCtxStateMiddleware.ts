'use strict';

const { getCanonicalUrl } = require('/libs/urlUtils');

module.exports = (ctx, next) => {
	// Properties of ctx.state are available as a globals in pug templates.
	ctx.state = ctx.state || {};

	// Expose `ctx`. It has useful information, like current URL.
	ctx.state.CTX = ctx;

	// Expose a counter unique to each page load, for setting unique IDs in
	// markup.
	ctx.state.COUNTER = 0;

	// Trigger pretty print via URL param.
	ctx.state.pretty = 'pretty' in ctx.query;

	ctx.state.CANONICAL_URL = getCanonicalUrl(ctx.href);

	return next();
};
