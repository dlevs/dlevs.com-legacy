import { Middleware, Context } from 'koa';
import Router from 'koa-router';
import flow from 'lodash/flow';
import sortBy from 'lodash/fp/sortBy';
import map from 'lodash/fp/map';
import Breadcrumb from '/lib/Breadcrumb';

// TODO: Move
interface Page {
	name: string;
	path: string;
	posts?: Page[];
}

interface Options {
	pages: Page[];
	breadcrumbRoot: Breadcrumb;
}

interface SitemapController {
	html: Middleware;
	xml: Middleware;
}

const sortPages: (pages: Page[]) => Page[] = flow(
	sortBy('name'),
	map((value: Page) => {
		if (!value.posts) {
			return value;
		}

		return {
			...value,
			posts: sortPages(value.posts),
		};
	}),
);

export default ({
	pages = [],
	breadcrumbRoot,
}: Options) => {
	const sortedPages = sortPages(pages);
	const breadcrumb = breadcrumbRoot.append({ name: 'Sitemap', slug: 'sitemap' });
	const getRenderVariables = (ctx: Context) => ({
		pages: sortedPages,
		breadcrumb,
		origin: ctx.origin,
		meta: { title: breadcrumb.currentPage.name },
	});
	const controller: SitemapController = {
		xml: async (ctx) => {
			await ctx.render('sitemapXml.pug', getRenderVariables(ctx as Context));
			ctx.type = 'xml';
		},
		html: async (ctx) => {
			await ctx.render('sitemapHtml.pug', getRenderVariables(ctx as Context));
		},
	};

	return {
		router: new Router()
			.get(`${breadcrumb.path}`, controller.html)
			.get(`${breadcrumb.path}.xml`, controller.xml),
		controller,
	};
};
