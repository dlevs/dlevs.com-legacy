const find = require('lodash/find');
const findIndex = require('lodash/findIndex');

const posts = require('../data/travel/posts');
const postsByCountry = require('../data/travel/postsByCountry');

const breadcrumbRoot = [
	{
		label: 'Home',
		href: '/'
	},
	{
		label: 'Travel Blog',
		href: '/travel'
	}
];

// Routes
//------------------------------------
module.exports = (router) => {

	router
		.get('/travel', async (ctx) => {
			await ctx.render('travel/travelPostListing', {
				title: 'Travel Blog',
				posts,
				breadcrumb: breadcrumbRoot
			});
		})
		.get('/travel/:countrySlug', async (ctx) => {
			const countryData = find(postsByCountry, ctx.params);

			if (!countryData) return;

			const {country, posts, href} = countryData;

			await ctx.render('travel/travelPostListing', {
				title: country,
				posts,
				breadcrumb: breadcrumbRoot.concat([
					{label: country, href}
				])
			});
		})
		.get('/travel/:countrySlug/:townSlug', async (ctx) => {
			const index = findIndex(posts, ctx.params);

			if (index === -1) return;

			const post = posts[index];
			const {country, countrySlug, town, href} = post;

			await ctx.render('travel/travelPost', {
				post,
				previousPost: posts[index - 1],
				nextPost: posts[index + 1],
				breadcrumb: breadcrumbRoot.concat([
					{label: country, href: `/travel/${countrySlug}`},
					{label: town, href}
				])
			});
		});

};
