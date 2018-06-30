'use strict';

const { testControllerSnapshots } = require('../tests/testLib/testUtils');
const robotsController = require('./robotsController')();

testControllerSnapshots(robotsController, {
	index: { contexts: [{}] },
});
