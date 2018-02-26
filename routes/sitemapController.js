'use strict';

const Router = require('koa-router');
const assert = require('assert');

const validatePages = (pages) => {
	pages.forEach(({ name, path, posts }) => {
		assert(typeof name === 'string', 'Page name must be a string');
		assert(typeof path === 'string', 'Page path must be a string');

		// TODO: Change "posts" to "pages"
		if (posts) {
			validatePages(posts);
		}
	});
};

module.exports = ({ pages = [], breadcrumbRoot }) => {
	validatePages(pages);
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
