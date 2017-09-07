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

	return {
		countrySlug,
		townSlug,
		humanDate: moment(post.date).format('MMMM YYYY'),
		href: `/travel/${countrySlug}/${townSlug}`,
		mainImage: post.images[0],
		...post
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
module.exports = processPosts(require('./postsRaw.json'));
