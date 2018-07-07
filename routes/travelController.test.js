'use strict';

const { testControllerSnapshots, getMockControllerParams } = require('../tests/testLib/testUtils');
const travelController = require('./travelController')(getMockControllerParams());

const renderPostsForCountryCtx = {
	params: {
		countrySlug: 'england',
	},
};

const renderPostCtx = {
	params: {
		countrySlug: 'england',
		townSlug: 'london',
	},
};

const imageQuery = { query: { pid: '2' } };

testControllerSnapshots(travelController.controller, {
	index: { contexts: [{}] },
	renderPostsForCountry: {
		contexts: [
			renderPostsForCountryCtx,
			{
				...renderPostsForCountryCtx,
				...imageQuery,
			},
			{ params: { countrySlug: 'something-non-existent' } },
		],
	},
	renderPost: {
		contexts: [
			renderPostCtx,
			{
				...renderPostCtx,
				...imageQuery,
			},
			{ params: { countrySlug: 'something-non-existent', townSlug: 'nothing' } },
		],
	},
});
