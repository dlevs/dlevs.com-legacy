'use strict';

const flow = require('lodash/flow');
const unset = require('lodash/fp/unset');
const { testControllerSnapshots } = require('/tests/testLib/testUtils');
const infoController = require('./infoController')();

testControllerSnapshots(infoController, {
	index: {
		mapData: data => flow(
			unset('ctx.body.date'),
			unset('ctx.body.serverStartDate'),
			unset('ctx.body.lastCommit'),
		)(data),
		contexts: [{}],
	},
});
