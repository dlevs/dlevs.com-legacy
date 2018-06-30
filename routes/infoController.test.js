'use strict';

const { testControllerSnapshots } = require('../tests/testLib/testUtils');
const infoController = require('./infoController')();

testControllerSnapshots(infoController, {
	index: {
		mapData(data) {
			// eslint-disable-next-line no-param-reassign
			delete data.ctx.body.date;
			// eslint-disable-next-line no-param-reassign
			delete data.ctx.body.serverStartDate;
			// eslint-disable-next-line no-param-reassign
			delete data.ctx.body.lastCommit;
			return data;
		},
		contexts: [{}],
	},
});
