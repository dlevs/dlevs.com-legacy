const filter = require('lodash/filter');
const findIndex = require('lodash/findIndex');
const posts = require('../data/travelPosts');
const {getPaginatedItemsFromCtx} = require('../lib/pagination');


const breadcrumbRoot = [
	{
		label: 'Home',
		href: '/'
	},
	{
		label: 'Blog',
		href: '/travel'
	}
];


// Routes
//------------------------------------
module.exports = (router) => {

	router
		.get('/travel', async (ctx) => {
			const pagination = getPaginatedItemsFromCtx(posts, ctx);

			await ctx.render('travel/travelPostListing', {
				title: 'Travel Blog',
				posts: pagination.data,
				pagination,
				breadcrumb: breadcrumbRoot
			});
		})
		.get('/travel/:countrySlug', async (ctx) => {
			const relevantPosts = filter(posts, ctx.params);
			const pagination = getPaginatedItemsFromCtx(relevantPosts, ctx);

			if (!relevantPosts.length) return;

			const {country, countrySlug} = relevantPosts[0];
			await ctx.render('travel/travelPostListing', {
				title: country,
				posts: pagination.data,
				pagination,
				breadcrumb: breadcrumbRoot.concat([
					{label: country, href: `/travel/${countrySlug}`}
				])
			});
		})
		.get('/travel/:countrySlug/:townSlug', async (ctx) => {
			const index = findIndex(posts, ctx.params);

			if (index === -1) return;

			const post = posts[index];
			const {country, countrySlug, town, link} = post;

			await ctx.render('travel/travelPost', {
				post,
				previousPost: posts[index - 1],
				nextPost: posts[index + 1],
				breadcrumb: breadcrumbRoot.concat([
					{label: country, href: `/travel/${countrySlug}`},
					{label: town, href: link}
				])
			});

		});

};
