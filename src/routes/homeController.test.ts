'use strict';

import { testControllerSnapshots } from '/tests/testLib/testUtils';
import homeController from './homeController'();

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
