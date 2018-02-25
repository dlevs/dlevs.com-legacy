'use strict';

module.exports = ({ pages = [] }) => {
	const getRenderVariables = ctx => ({ pages, origin: ctx.origin });

	return {
		xml: async (ctx) => {
			await ctx.render('sitemapXml.pug', getRenderVariables(ctx));
			ctx.type = 'xml';
		},
		html: async (ctx) => {
			await ctx.render('sitemapHtml.pug', getRenderVariables(ctx));
		},
	};
};
