'use strict';

const { getRevvedPath } = require('/libs/assetUtils');

export default async (ctx, next) => {
	await next();

	if (ctx.type === 'text/html') {
		ctx.set('Link', `<${getRevvedPath('/styles/main.css')}>; rel=preload; as=style`);
	}
};
