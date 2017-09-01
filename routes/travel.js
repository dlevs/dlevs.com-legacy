const filter = require('lodash/filter');
const findIndex = require('lodash/findIndex');
const groupBy = require('lodash/fp/groupBy');
const orderBy = require('lodash/fp/orderBy');
const map = require('lodash/fp/map');
const uniqBy = require('lodash/uniqBy');
const flow = require('lodash/flow');
const kebabCase = require('lodash/kebabCase');
const moment = require('moment');
const assert = require('assert');


// Functions
//------------------------------------
const expandPosts = (posts) => posts.map((post) => {
	const countrySlug = kebabCase(post.country);
	const townSlug = kebabCase(post.town);
	const images = post.images.map((img) => ({
		...img,
		src: `/images/travel/${countrySlug}/${img.src}.jpg`
	}));
	const humanDate = moment(post.date).format('MMMM YYYY');

	return {
		countrySlug,
		townSlug,
		...post,
		href: `/travel/${countrySlug}/${townSlug}`,
		images,
		humanDate,
		title: `${post.town}, ${post.country} - ${humanDate}`,
		mainImage: images[0]
	}
});
const validatePosts = (posts) => {
	assert(
		posts.length === uniqBy(posts, 'href').length,
		'Some posts share the same href. This is not allowed as URLs must be unique.'
	);

	return posts;
};
const orderPosts = orderBy('date', 'desc');
const processPosts = flow(
	expandPosts,
	validatePosts,
	orderPosts
);
const groupPostsByCountry = flow(
	groupBy('country'),
	map((posts) => ({country: posts[0].country, posts})),
	orderBy('country')
);


// Variables
//------------------------------------
const posts = processPosts(require('../data/travel-posts.json'));
const postsByCountry = groupPostsByCountry(posts);
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
			await ctx.render('travel/travel-post-listing', {
				title: 'Travel Blog',
				posts,
				breadcrumb: breadcrumbRoot
			});
		})
		.get('/travel/:countrySlug', async (ctx) => {
			const relevantPosts = filter(posts, ctx.params);

			if (!relevantPosts.length) return;

			const {country, countrySlug} = relevantPosts[0];
			await ctx.render('travel/travel-post-listing', {
				title: country,
				posts: relevantPosts,
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

			await ctx.render('travel/travel-post', {
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
