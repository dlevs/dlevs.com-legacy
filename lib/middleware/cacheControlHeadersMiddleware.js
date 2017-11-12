const { ASSET_MAX_AGE, MIME_TYPES_TO_CACHE } = require('../constants');
const { createMimeMatcher } = require('../mimeTypeUtils');

const shouldCacheType = createMimeMatcher(MIME_TYPES_TO_CACHE);

module.exports = async (ctx, next) => {
	await next();

	if (
		process.env.NODE_ENV === 'production' &&
		shouldCacheType(ctx.type)
	) {
		ctx.set('Cache-Control', `max-age=${ASSET_MAX_AGE}`);
	}
};
