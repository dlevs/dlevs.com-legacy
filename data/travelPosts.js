const orderBy = require('lodash/fp/orderBy');
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
		src: `/images/travel/${countrySlug}/${img.src}.jpg`,
		srcLarge: `/images/travel/${countrySlug}/${img.src}_large.jpg`
	}));
	const humanDate = moment(post.date).format('MMMM YYYY');

	return {
		countrySlug,
		townSlug,
		...post,
		href: `/travel/${countrySlug}/${townSlug}`,
		images,
		humanDate,
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


// Exports
//------------------------------------
module.exports = processPosts(require('./travelPostsRaw'));
