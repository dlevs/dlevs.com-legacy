import { Middleware } from 'koa';
import { StringMap } from '@root/lib/types';

const redirects: StringMap = {
	'/coverage': '/coverage/index.html',
};

const redirect: Middleware = async (ctx, next) => {
	if (redirects[ctx.path]) {
		ctx.status = 301;
		ctx.redirect(redirects[ctx.path]);
	} else {
		await next();
	}
};

export default redirect;
