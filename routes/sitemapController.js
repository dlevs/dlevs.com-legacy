'use strict';

const Router = require('koa-router');
const assert = require('assert');
const flow = require('lodash/flow');
const sortBy = require('lodash/fp/sortBy');
const map = require('lodash/fp/map');
const forEach = require('lodash/fp/forEach');

const validatePage = ({ name, path }) => {
	assert(typeof name === 'string', 'Page name must be a string');
	assert(typeof path === 'string', 'Page path must be a string');
};

const sortPages = flow(
	forEach(validatePage),
	sortBy('name'),
	map((value) => {
		if (!value.posts) {
			return value;
		}

		return {
			...value,
			posts: sortPages(value.posts),
		};
	}),
);

module.exports = ({ pages = [], breadcrumbRoot }) => {
	const sortedPages = sortPages(pages);
	const breadcrumb = breadcrumbRoot.append({ name: 'Sitemap', slug: 'sitemap' });
	const getRenderVariables = ctx => ({
		pages: sortedPages,
		breadcrumb,
		origin: ctx.origin,
		meta: { title: breadcrumb.currentPage.name },
	});
	const controller = {
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
			.get(`${breadcrumb.path}`, controller.html)
			.get(`${breadcrumb.path}.xml`, controller.xml),
		controller,
	};
};
