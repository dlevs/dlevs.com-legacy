const startCase = require('lodash/startCase');
const camelCase = require('lodash/camelCase');
const { expandBreadcrumb } = require('../lib/breadcrumbUtils');

module.exports = (options) => {
	const { breadcrumbRoot, rootPath } = options;

	return {
		index: async (ctx) => {
			const { slug = 'index' } = ctx.params;
			let title = 'Pattern Library';
			let breadcrumb = breadcrumbRoot;

			if (slug !== 'index') {
				const label = startCase(slug);
				title = `${label} - ${title}`;
				breadcrumb = breadcrumb.concat({ slug, label, path: ctx.path });
			}

			try {
				await ctx.render(
					`patternLibrary/${camelCase(slug)}.pug`,
					{
						title,
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
		},
	};
};
