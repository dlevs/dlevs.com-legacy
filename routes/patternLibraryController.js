const startCase = require('lodash/startCase');
const camelCase = require('lodash/camelCase');
const {expandBreadcrumb} = require('../lib/breadcrumbUtils');

module.exports = (options) => {
	const {breadcrumbRoot} = options;

	return {
		index: async (ctx) => {
			const {slug = 'index'} = ctx.params;

			const breadcrumb = slug === 'index'
				? breadcrumbRoot
				: breadcrumbRoot.concat({
					slug,
					label: startCase(slug),
					path: ctx.path
				});

			try {
				await ctx.render(
					`patternLibrary/${camelCase(slug)}`,
					{
						title: 'Pattern Library',
						breadcrumb: expandBreadcrumb(breadcrumb),
						path: ctx.path
					}
				)
			} catch (err) {
				// If template was not found, do nothing.
				// This will fallback to 404 error page.
				if (err.code !== 'ENOENT') {
					throw err;
				}
			}
		}
	}
};
