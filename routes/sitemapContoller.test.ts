'use strict';

const { testControllerSnapshots, getMockControllerParams } = require('../tests/testLib/testUtils');
const sitemapController = require('./sitemapController');

const sitemapControllerWithPages = sitemapController({
	...getMockControllerParams(),
	pages: [
		{
			name: 'Home',
			path: '/',
		},
		{
			name: 'Travel',
			path: '/travel',
			posts: [
				{
					name: 'Japan',
					path: '/travel/japan',
				},
			],
		},
	],
});

const sitemapControllerWithoutPages = sitemapController({
	...getMockControllerParams(),
});

const tests = {
	html: { contexts: [{}] },
	xml: { contexts: [{}] },
};

testControllerSnapshots(sitemapControllerWithPages.controller, tests);
testControllerSnapshots(sitemapControllerWithoutPages.controller, tests);
