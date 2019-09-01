import { Context } from 'koa';
import Router from 'koa-router';
import assert from 'assert';
import flow from 'lodash/flow';
import sortBy from 'lodash/fp/sortBy';
import map from 'lodash/fp/map';
import forEach from 'lodash/fp/forEach';
import Breadcrumb from '../lib/Breadcrumb';

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

module.exports = ({ pages = [], breadcrumbRoot: Breadcrumb }) => {
	const sortedPages = sortPages(pages);
	const breadcrumb = breadcrumbRoot.append({ name: 'Sitemap', slug: 'sitemap' });
	const getRenderVariables = (ctx: Context) => ({
		pages: sortedPages,
		breadcrumb,
		origin: ctx.origin,
		meta: { title: breadcrumb.currentPage.name },
	});
	const controller = {
		xml: async (ctx: Context) => {
			await ctx.render('sitemapXml.pug', getRenderVariables(ctx));
			ctx.type = 'xml';
		},
		html: async (ctx: Context) => {
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
