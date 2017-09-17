const moment = require('moment');
const last = require('lodash/last');
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
			const images = post.images.map((image) => ({
				...image,
				geoLocation: `${post.town}, ${post.country}`
			}));

			return {
				countrySlug,
				townSlug,
				breadcrumb,
				path: last(breadcrumb).path,
				humanDate: moment(post.date).format('MMMM YYYY'),
				mainImage: images[0],
				...post,
				images
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
			const images = posts.map(({mainImage}) => mainImage);
			return {
				country,
				countrySlug,
				breadcrumb,
				path: last(breadcrumb).path,
				posts,
				// Images for sitemap
				images,
				mainImage: images[0]
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
			const index = findIndex(postsByCountry, ctx.params);

			if (index === -1) return;

			const {country, posts, breadcrumb} = postsByCountry[index];

			await ctx.render('travel/travelPostListing', {
				title: country,
				posts,
				previousPost: postsByCountry[index - 1],
				nextPost: postsByCountry[index + 1],
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
