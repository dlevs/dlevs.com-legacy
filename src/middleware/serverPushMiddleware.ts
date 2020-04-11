import { Middleware } from 'koa';
import { getRevvedPath } from '/lib/assetUtils';

const serverPushMiddleware: Middleware = async (ctx, next) => {
	await next();

	if (ctx.type === 'text/html') {
		ctx.set('Link', `<${getRevvedPath('/styles/main.css')}>; rel=preload; as=style`);
	}
};

export default serverPushMiddleware;
