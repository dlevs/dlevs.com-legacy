'use strict';

/**
 * Takes an array of objects with a slug property, and adds
 * the cumulative URL path to each object.
 *
 * @param {Object[]} breadcrumb
 * @returns {Object[]}
 */
exports.expandBreadcrumb = (breadcrumb) => {
	const currentSlugs = [];

	return breadcrumb.map(({ slug = '', ...otherProps }) => {
		currentSlugs.push(slug);

		return {
			...otherProps,
			slug,
			path: currentSlugs.join('/') || '/',
		};
	});
};
