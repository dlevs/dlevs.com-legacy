'use strict';

const assert = require('assert');
const last = require('lodash/last');

/**
 * Takes an array of objects with a slug property, and adds
 * the cumulative URL path to each object.
 *
 * @param {Object[]} breadcrumb
 * @returns {Object[]}
 */
const expandBreadcrumb = (breadcrumb) => {
	const currentSlugs = [];

	return breadcrumb.map(({ slug, ...otherProps }) => {
		currentSlugs.push(slug);

		return {
			...otherProps,
			slug,
			path: currentSlugs.join('/') || '/',
		};
	});
};

const validatePage = ({ name, slug }) => {
	assert(typeof name === 'string', 'Page name must be a string');
	assert(typeof slug === 'string', 'Page slug must be a string');
};

class Breadcrumb {
	constructor(parts) {
		parts.forEach(validatePage);
		this.parts = expandBreadcrumb(parts);
	}

	append(parts) {
		return new Breadcrumb(this.parts.concat(parts));
	}

	get currentPage() {
		return last(this.parts);
	}

	get path() {
		return this.currentPage.path;
	}
}

module.exports = Breadcrumb;
