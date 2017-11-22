const findIndex = require('lodash/findIndex');
const { expandBreadcrumb } = require('../lib/breadcrumbUtils');
const { getPosts } = require('../data/travelPosts');
const { getImageMeta } = require('../lib/imageUtils');
const { ORIGIN } = require('../config');

module.exports = (options) => {
	const { breadcrumbRoot } = options;
	const { posts, postsByCountry } = getPosts(options);

	return {

		index: async (ctx) => {
			await ctx.render('travel/travelPostListing.pug', {
				posts,
				breadcrumb: expandBreadcrumb(breadcrumbRoot),
				meta: {
					title: 'Travel Blog',
					description: 'Photos from around the world.',
					og: { image: getImageMeta(posts[0].mainImage.src).large },
				},
			});
		},

		renderPostsForCountry: async (ctx) => {
			const index = findIndex(postsByCountry, ctx.params);

			if (index === -1) return;

			const {
				country,
				// eslint-disable-next-line no-shadow
				posts,
				description,
				breadcrumb,
			} = postsByCountry[index];

			await ctx.render('travel/travelPostListing.pug', {
				posts,
				previousPost: postsByCountry[index - 1],
				nextPost: postsByCountry[index + 1],
				breadcrumb,
				meta: {
					title: country,
					description,
					og: { image: getImageMeta(posts[0].mainImage.src).large },
				},
			});
		},

		renderPost: async (ctx) => {
			const index = findIndex(posts, ctx.params);
			const { pid = '1' } = ctx.query;
			const imageIndex = Number(pid) - 1;

			if (index === -1) return;

			const post = posts[index];
			const image = getImageMeta(post.images[imageIndex].src).large;

			await ctx.render('travel/travelPost.pug', {
				post,
				previousPost: posts[index - 1],
				nextPost: posts[index + 1],
				breadcrumb: post.breadcrumb,
				meta: {
					title: post.town,
					description: post.description,
					og: {
						image,
						type: 'article',
						'article:published_time': post.date,
						'article:author': post.author,
						'article:section': 'Travel',
					},
					jsonLd: [
						{
							'@context': 'http://schema.org',
							'@type': 'BlogPosting',
							headline: post.description,
							image: image.absoluteSrc,
							genre: 'travel',
							url: ctx.href,
							datePublished: post.date,
							author: ORIGIN,
							publisher: ORIGIN,
						},
					],
				},
			});
		},

		sitemap: [
			...postsByCountry,
			...posts,
		],

	};
};
