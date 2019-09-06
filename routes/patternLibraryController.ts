import { Context } from 'koa';
import { basename } from 'path';
import glob from 'glob';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import Router from 'koa-router';
import { root } from '/lib/pathUtils';
import Breadcrumb from '/lib/Breadcrumb';

interface Options {
	breadcrumbRoot: Breadcrumb;
}

// TODO: This controller essentially serves static pug files.
// This can be turned into a reusable function.
export default ({ breadcrumbRoot }: Options) => {
	const pageBreadcrumb = breadcrumbRoot.append({
		slug: 'pattern-library',
		name: 'Pattern Library',
	});
	const serve = async (ctx: Context) => {
		const { slug = 'index' } = ctx.params;
		let title = 'Pattern Library';
		let breadcrumb = pageBreadcrumb;

		if (slug !== 'index') {
			const name = startCase(slug);
			title = `${name} - ${title}`;
			breadcrumb = breadcrumb.append({ slug, name });
		}

		try {
			await ctx.render(
				`patternLibrary/${camelCase(slug)}.pug`,
				{
					meta: {
						title,
						description: 'Common styling and code examples.',
					},
					breadcrumb,
					rootPath: pageBreadcrumb.path,
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
			.get(`${pageBreadcrumb.path}`, serve)
			.get(`${pageBreadcrumb.path}/:slug`, serve),

		sitemap: {
			...pageBreadcrumb.currentPage,
			// TODO: Change the word "posts" to "pages".
			posts: glob.sync(root('views/patternLibrary/*.pug'))
				.map((filepath) => {
					const slug = basename(filepath, '.pug');
					return {
						name: startCase(slug),
						path: `${pageBreadcrumb.path}/${slug}`,
					};
				})
				.filter(({ name }) => name !== 'Index'),
		},
	};
};
