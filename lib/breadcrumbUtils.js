// @flow

/**
 * Takes an array of objects with a slug property, and adds
 * the cumulative URL path to each object.
 *
 * @param {Object[]} breadcrumb
 * @returns {Object[]}
 */
exports.expandBreadcrumb = (breadcrumb: []): Array<Object> => {
	const currentSlugs: Array<string> = [];

	return breadcrumb.map(({ slug = '', ...otherProps }) => {
		currentSlugs.push(slug);

		return {
			...otherProps,
			slug,
			path: currentSlugs.join('/') || '/',
		};
	});
};
