import { Middleware } from 'koa';
import { StringMap } from '@root/lib/types';

const redirects: StringMap = {
	'/coverage': '/coverage/index.html',
};

const redirect: Middleware = async (ctx, next) => {
	const redirectPath = redirects[ctx.path];
	if (redirectPath) {
		ctx.status = 301;
		ctx.redirect(redirectPath);
	} else {
		await next();
	}
};

export default redirect;
