import { KoaMiddlewareFn, StringMap } from '/lib/types';

const redirects: StringMap = {
	'/coverage': '/coverage/index.html',
};

const redirect: KoaMiddlewareFn = async (ctx, next) => {
	if (redirects[ctx.path]) {
		ctx.status = 301;
		ctx.redirect(redirects[ctx.path]);
	} else {
		await next();
	}
};

export default redirect;
