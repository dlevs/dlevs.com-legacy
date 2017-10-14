const ASSET_META = require('../../data/generated/assets.json');

module.exports = async (ctx, next) => {
	await next();

	if (ctx.type === 'text/html') {
		ctx.set('Link', `</styles/${ASSET_META['main.css']}>; rel=preload; as=style`);
	}
};
