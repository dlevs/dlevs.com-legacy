import { Middleware } from 'koa';
import Router from 'koa-router';
import findIndex from 'lodash/findIndex';
import Breadcrumb from '/lib/Breadcrumb';
import { getPosts } from '/data/travelPosts';
import { getImageMeta } from '/lib/mediaUtils';

interface Options {
	breadcrumbRoot: Breadcrumb;
}

interface TravelController {
	index: Middleware;
	renderPost: Middleware;
	renderPostsForCountry: Middleware;
}

export default ({ breadcrumbRoot }: Options) => {
	const pageBreadcrumb = breadcrumbRoot.append({
		slug: 'travel',
		name: 'Travel',
	});
	const { posts, postsByCountry } = getPosts({
		breadcrumbRoot: pageBreadcrumb,
	});
	const controller: TravelController = {
		index: async (ctx) => {
			await ctx.render('travel/travelPostListing.pug', {
				posts,
				breadcrumb: pageBreadcrumb,
				meta: {
					title: 'Travel Blog',
					description: 'Photos from around the world.',
					og: {
						'_og:image': getImageMeta(posts[0].mainImage.src).versions.large,
						'og:image:alt': posts[0].mainImage.alt,
					},
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
					og: {
						'_og:image': getImageMeta(posts[0].mainImage.src).versions.large,
						'og:image:alt': posts[0].mainImage.alt,
					},
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
					description: ctx.query.pid
						? post.images[imageIndex].caption
						: post.description,
					og: {
						'_og:image': getImageMeta(post.images[imageIndex].src).versions.large,
						'og:image:alt': post.images[imageIndex].alt,
						'og:type': 'article',
						'article:published_time': post.datePublished,
						'article:modified_time': post.dateModified,
						'article:author': post.author,
						'article:section': 'Travel',
						'article:tag': [post.town, post.country],
					},
					jsonLd: [
						{
							'@context': 'http://schema.org',
							'@type': 'BlogPosting',
							headline: post.description,
							image: getImageMeta(post.mainImage.src).versions.large.absoluteSrc,
							genre: 'travel',
							url: ctx.state.CANONICAL_URL,
							datePublished: post.datePublished,
							dateModified: post.dateModified,
							author: process.env.ORIGIN,
							publisher: process.env.ORIGIN,
							mainEntityOfPage: ctx.state.CANONICAL_URL,
						},
					],
				},
			});
		},
	};

	return {

		router: new Router()
			.get(`${pageBreadcrumb.path}`, controller.index)
			.get(`${pageBreadcrumb.path}/:countrySlug`, controller.renderPostsForCountry)
			.get(`${pageBreadcrumb.path}/:countrySlug/:townSlug`, controller.renderPost),

		sitemap: {
			...pageBreadcrumb.currentPage,
			posts: postsByCountry,
		},

		controller,

	};
};
