const moment = require('moment');
const last = require('lodash/last');
const orderBy = require('lodash/fp/orderBy');
const flow = require('lodash/flow');
const kebabCase = require('lodash/kebabCase');
const sortBy = require('lodash/fp/sortBy');
const groupBy = require('lodash/fp/groupBy');
const map = require('lodash/fp/map');
const { getImageMeta } = require('../lib/imageUtils');
const { expandBreadcrumb } = require('../lib/breadcrumbUtils');
const rawPostsData = require('../data/travelPostsRaw');
const { ORIGIN } = require('../config');

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
		const imageMeta = getImageMeta(images[0].src);

		return {
			countrySlug,
			townSlug,
			breadcrumb,
			path,
			humanDate: moment(post.date).format('MMMM YYYY'),
			mainImage: images[0],
			jsonLd: {
				'@context': 'http://schema.org',
				'@type': 'BlogPosting',
				headline: `${post.town} - ${post.country}`,
				image: imageMeta && `${ORIGIN}${imageMeta.large.src}`,
				genre: 'travel',
				url: `${ORIGIN}${path}`,
				datePublished: post.date,
				author: ORIGIN,
				publisher: ORIGIN,
			},
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
			posts,
			// Images for sitemap
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
 * The optional second paramater allows for testing.
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
