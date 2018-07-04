'use strict';

const redirects = {
	'/coverage': '/coverage/index.html',
};

const redirect = async (ctx, next) => {
	if (redirects[ctx.path]) {
		ctx.status = 301;
		ctx.redirect(redirects[ctx.path]);
	} else {
		await next();
	}
};

module.exports = redirect;
