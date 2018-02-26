'use strict';

const Router = require('koa-router');

module.exports = ({ pages = [], breadcrumbRoot }) => {
	const breadcrumb = breadcrumbRoot.append({ name: 'Sitemap', slug: 'sitemap' });
	const getRenderVariables = ctx => ({
		pages,
		breadcrumb,
		origin: ctx.origin,
		meta: { title: breadcrumb.currentPage.name },
	});

	const controllers = {
		xml: async (ctx) => {
			await ctx.render('sitemapXml.pug', getRenderVariables(ctx));
			ctx.type = 'xml';
		},
		html: async (ctx) => {
			await ctx.render('sitemapHtml.pug', getRenderVariables(ctx));
		},
	};

	return {
		router: new Router()
			.get(`${breadcrumb.path}`, controllers.html)
			.get(`${breadcrumb.path}.xml`, controllers.xml),
	};
};
