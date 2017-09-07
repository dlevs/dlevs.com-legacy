// Dependencies
//------------------------------------
const sortBy = require('lodash/fp/sortBy');
const groupBy = require('lodash/fp/groupBy');
const map = require('lodash/fp/map');
const flow = require('lodash/flow');
const {getParentPath} = require('../../lib/util');


// Functions
//------------------------------------
const getPostsByCountry = flow(
	groupBy('country'),
	map((posts) => {
		const {country, countrySlug, href} = posts[0];
		return {
			country,
			countrySlug,
			posts,
			href: getParentPath(href),
			images: posts.map(({mainImage}) => mainImage),
		}
	}),
	sortBy('country')
);


// Exports
//------------------------------------
module.exports = getPostsByCountry(require('./posts'));
