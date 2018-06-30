'use strict';

const { getControllerRenderData } = require('../tests/testLib/testUtils');
const homeController = require('./homeController')();

describe('index', () => {
	test('data passed to template', async () => {
		const data = await getControllerRenderData(homeController.index);
		expect(data).toBeDefined();
		expect(data).toMatchSnapshot();
	});
	test('data passed to template when providing url parameters', async () => {
		const data = await getControllerRenderData(homeController.index, {
			query: { pid: 0 },
		});
		expect(data).toBeDefined();
		expect(data).toMatchSnapshot();
	});
});
