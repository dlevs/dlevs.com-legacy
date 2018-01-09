'use strict';

const moment = require('moment');
const last = require('lodash/last');
const orderBy = require('lodash/fp/orderBy');
const flow = require('lodash/flow');
const kebabCase = require('lodash/kebabCase');
const sortBy = require('lodash/fp/sortBy');
const groupBy = require('lodash/fp/groupBy');
const map = require('lodash/fp/map');
const { expandBreadcrumb } = require('../lib/breadcrumbUtils');
const { SITE_AUTHOR } = require('../lib/constants');
const rawPostsData = require('../data/travelPostsRaw');

const expandPosts = ({ breadcrumbRoot }) => flow(
	posts => posts.map((post) => {
		const countrySlug = kebabCase(post.country);
		const townSlug = kebabCase(post.town);
		const breadcrumb = expandBreadcrumb([
			...breadcrumbRoot,
			{
				slug: countrySlug,
				label: post.country,
			},
			{
				slug: townSlug,
				label: post.town,
			},
		]);
		const images = post.images.map(image => ({
			...image,
			geoLocation: `${post.town}, ${post.country}`,
		}));
		const { path } = last(breadcrumb);

		return {
			countrySlug,
			townSlug,
			breadcrumb,
			path,
			humanDate: moment(post.date).format('MMMM YYYY'),
			description: `Photos from ${post.town}, ${post.country}.`,
			author: SITE_AUTHOR,
			mainImage: images[0],
			...post,
			images,
		};
	}),
	orderBy('date', 'desc'),
);

const groupPostsByCountry = ({ breadcrumbRoot }) => flow(
	groupBy('country'),
	map((posts) => {
		const { country, countrySlug } = posts[0];
		const breadcrumb = expandBreadcrumb([
			...breadcrumbRoot,
			{
				slug: countrySlug,
				label: country,
			},
		]);
		const images = posts.map(({ mainImage }) => mainImage);
		return {
			country,
			countrySlug,
			breadcrumb,
			path: last(breadcrumb).path,
			description: `Photos from ${country}.`,
			author: SITE_AUTHOR,
			posts,
			images,
			mainImage: images[0],
		};
	}),
	sortBy('country'),
);

/**
 * Get an array of travel posts, expanded with URL paths, human-readable dates,
 * etc.
 *
 * The generated URLs are relative to the `options.breadcrumbRoot` property.
 *
 * The optional second parameter allows for testing.
 *
 * @param {Object} options
 * @param {Array}  options.breadcrumbRoot
 * @param {Array} [rawPosts]
 * @return {Object}
 */
exports.getPosts = (options, rawPosts = rawPostsData) => {
	const posts = expandPosts(options)(rawPosts);
	const postsByCountry = groupPostsByCountry(options)(posts);

	return { posts, postsByCountry };
};
