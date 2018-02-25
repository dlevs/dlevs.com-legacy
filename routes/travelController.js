'use strict';

const Router = require('koa-router');
const findIndex = require('lodash/findIndex');
const { expandBreadcrumb } = require('../lib/breadcrumbUtils');
const { getPosts } = require('../data/travelPosts');
const { getImageMeta } = require('../lib/imageUtils');
const { ORIGIN } = require('../config');


module.exports = ({ breadcrumbRoot }) => {
	const page = {
		slug: 'travel',
		name: 'Travel',
	};
	const { posts, postsByCountry } = getPosts({
		breadcrumbRoot: [...breadcrumbRoot, page],
	});
	const controllers = {
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
			const { countrySlug } = ctx.params;
			const index = findIndex(postsByCountry, { countrySlug });

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
			const { countrySlug, townSlug } = ctx.params;
			const index = findIndex(posts, { countrySlug, townSlug });

			// Get gallery image index from query string, for setting og:image to
			// shared image from photoswipe gallery.
			const { pid = '1' } = ctx.query;
			const imageIndex = Number(pid) - 1;

			if (index === -1) return;

			const post = posts[index];

			await ctx.render('travel/travelPost.pug', {
				post,
				previousPost: posts[index - 1],
				nextPost: posts[index + 1],
				breadcrumb: post.breadcrumb,
				meta: {
					title: post.town,
					description: post.description,
					og: {
						image: getImageMeta(post.images[imageIndex].src).large,
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
							image: getImageMeta(post.mainImage.src).large.absoluteSrc,
							genre: 'travel',
							url: ctx.href,
							datePublished: post.date,
							dateModified: post.dateModified || post.date,
							author: ORIGIN,
							publisher: ORIGIN,
							mainEntityOfPage: ctx.href,
						},
					],
				},
			});
		},
	};

	return {

		router: new Router()
			.get(`/${page.slug}`, controllers.index)
			.get(`/${page.slug}/:countrySlug`, controllers.renderPostsForCountry)
			.get(`/${page.slug}/:countrySlug/:townSlug`, controllers.renderPost),

		sitemap: {
			...page,
			posts: postsByCountry,
		},

	};
};
