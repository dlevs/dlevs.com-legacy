'use strict';

const { getControllerRenderData } = require('../tests/testLib/testUtils');
const infoController = require('./infoController')();

describe('index', () => {
	test('data passed to template', async () => {
		const data = await getControllerRenderData(infoController.index);
		expect(data.ctx.body).toBeDefined();

		delete data.ctx.body.date;
		delete data.ctx.body.serverStartDate;
		delete data.ctx.body.lastCommit;

		expect(data.ctx.body).toMatchSnapshot();
	});
});
