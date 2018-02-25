'use strict';

const glob = require('glob');
const Router = require('koa-router');
const { basename } = require('path');
const { root } = require('../lib/pathUtils');
const last = require('lodash/last');
const startCase = require('lodash/startCase');
const camelCase = require('lodash/camelCase');
const { expandBreadcrumb } = require('../lib/breadcrumbUtils');


// TODO: This controller essentially serves static pug files.
// This can be turned into a reusable function.
module.exports = ({ breadcrumbRoot }) => {
	const page = {
		slug: 'pattern-library',
		name: 'Pattern Library',
	};
	const pageBreadcrumb = expandBreadcrumb(breadcrumbRoot.concat(page));
	const rootPath = last(pageBreadcrumb).path;
	const serve = async (ctx) => {
		const { slug = 'index' } = ctx.params;
		let title = 'Pattern Library';
		let breadcrumb = pageBreadcrumb;

		if (slug !== 'index') {
			const name = startCase(slug);
			title = `${name} - ${title}`;
			breadcrumb = breadcrumb.concat({ slug, name });
		}

		try {
			await ctx.render(
				`patternLibrary/${camelCase(slug)}.pug`,
				{
					meta: {
						title,
						description: 'Common styling and code examples.',
					},
					breadcrumb: expandBreadcrumb(breadcrumb),
					rootPath,
				},
			);
		} catch (err) {
			// If template was not found, do nothing.
			// This will fallback to 404 error page.
			if (err.code !== 'ENOENT') {
				throw err;
			}
		}
	};

	return {
		router: new Router()
			.get(`/${page.slug}`, serve)
			.get(`/${page.slug}/:slug`, serve),

		sitemap: {
			...page,
			posts: glob.sync(root('views/patternLibrary/*.pug'))
				.map((filepath) => {
					const slug = basename(filepath, '.pug');
					return {
						name: startCase(slug),
						path: `${rootPath}/${slug}`,
					};
				})
				.filter(({ name }) => name !== 'Index'),
		},
	};
};
