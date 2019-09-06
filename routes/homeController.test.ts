'use strict';

const { testControllerSnapshots } = require('/tests/testLib/testUtils');
const homeController = require('./homeController')();

testControllerSnapshots(homeController, {
	index: {
		contexts: [
			{},
			// A project to use for og:image
			{ query: { pid: '2' } },
			// A project that doesn't exist
			{ query: { pid: '40' } },
		],
	},
});
