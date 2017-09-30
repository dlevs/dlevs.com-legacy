const findIndex = require('lodash/findIndex');
const {expandBreadcrumb} = require('../lib/breadcrumbUtils');
const {getPosts} = require('../data/travelPosts');

module.exports = (options) => {
	const {breadcrumbRoot} = options;
	const {posts, postsByCountry} = getPosts(options);

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
