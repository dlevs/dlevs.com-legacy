const moment = require('moment');
const last = require('lodash/last');
const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const orderBy = require('lodash/fp/orderBy');
const flow = require('lodash/flow');
const kebabCase = require('lodash/kebabCase');
const sortBy = require('lodash/fp/sortBy');
const groupBy = require('lodash/fp/groupBy');
const map = require('lodash/fp/map');
const {expandBreadcrumb} = require('../lib/util');
const rawPosts = require('../data/travelPosts');


module.exports = ({breadcrumbRoot}) => {

	const expandPosts = flow(
		(posts) => posts.map((post) => {
			const countrySlug = kebabCase(post.country);
			const townSlug = kebabCase(post.town);
			const breadcrumb = expandBreadcrumb([
				...breadcrumbRoot,
				{
					slug: countrySlug,
					label: post.country
				},
				{
					slug: townSlug,
					label: post.town
				}
			]);

			return {
				countrySlug,
				townSlug,
				breadcrumb,
				path: last(breadcrumb).path,
				humanDate: moment(post.date).format('MMMM YYYY'),
				mainImage: post.images[0],
				...post
			}
		}),
		orderBy('date', 'desc')
	);

	const groupPostsByCountry = flow(
		groupBy('country'),
		map((posts) => {
			const {country, countrySlug} = posts[0];
			const breadcrumb = expandBreadcrumb([
				...breadcrumbRoot,
				{
					slug: countrySlug,
					label: country
				}
			]);
			return {
				country,
				countrySlug,
				breadcrumb,
				path: last(breadcrumb).path,
				posts,
				// Images for sitemap
				images: posts.map(({mainImage}) => mainImage)
			}
		}),
		sortBy('country')
	);

	const posts = expandPosts(rawPosts);
	const postsByCountry = groupPostsByCountry(posts);

	return {
		index: async (ctx) => {
			await ctx.render('travel/travelPostListing', {
				title: 'Travel Blog',
				posts,
				breadcrumb: expandBreadcrumb(breadcrumbRoot)
			})
		},
		renderPostsForCountry: async (ctx) => {
			const countryData = find(postsByCountry, ctx.params);

			if (!countryData) return;

			const {country, posts, breadcrumb} = countryData;

			await ctx.render('travel/travelPostListing', {
				title: country,
				posts,
				breadcrumb
			});
		},
		renderPost: async (ctx) => {
			const index = findIndex(posts, ctx.params);

			if (index === -1) return;

			const post = posts[index];

			await ctx.render('travel/travelPost', {
				post,
				previousPost: posts[index - 1],
				nextPost: posts[index + 1],
				breadcrumb: post.breadcrumb
			});
		},
		sitemap: [
			...postsByCountry,
			...posts
		]
	}
};
