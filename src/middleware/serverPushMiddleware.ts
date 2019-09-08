import { getRevvedPath } from '@root/lib/assetUtils';
import { KoaMiddlewareFn } from '@root/lib/types';

const serverPushMiddleware: KoaMiddlewareFn = async (ctx, next) => {
	await next();

	if (ctx.type === 'text/html') {
		ctx.set('Link', `<${getRevvedPath('/styles/main.css')}>; rel=preload; as=style`);
	}
};

export default serverPushMiddleware;
