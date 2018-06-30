'use strict';

const { testControllerSnapshots } = require('../tests/testLib/testUtils');
const homeController = require('./homeController')();

testControllerSnapshots(homeController, {
	index: {
		contexts: [
			{},
			{ query: { pid: '2' } },
		],
	},
});
