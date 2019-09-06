'use strict';

const each = require('lodash/each');
const Breadcrumb = require('/lib/Breadcrumb');

/**
 * Execute a controller using mock data.
 * Return the data passed to template.
 *
 * @param {Function} controller
 * @param {Object} params
 * @returns {*}
 */
exports.getControllerRenderData = async (controller, params) => {
	let renderedData;
	const ctx = {
		query: {},
		state: {
			CANONICAL_URL: 'DUMMY_CANONICAL_URL',
		},
		...params,
		render(template, data) {
			renderedData = data;
		},
	};

	await controller(ctx);

	return {
		ctx,
		renderedData,
	};
};

/**
 * Snapshot test methods of a controller by checking the data passed
 * to the template and the state of the `ctx` variable.
 *
 * @param {Function} controller
 * @param {Object} methods
 */
exports.testControllerSnapshots = (controller, methods) => {
	each(methods, ({ contexts, mapData }, methodName) => {
		describe(methodName, () => {
			contexts.forEach((ctx) => {
				test(`data passed to template with ctx ${JSON.stringify(ctx)}`, async () => {
					let data = await exports.getControllerRenderData(controller[methodName], ctx);

					if (typeof mapData === 'function') {
						data = mapData(data);
					}

					expect(data).toBeDefined();
					expect(data).toMatchSnapshot();
				});
			});
		});
	});
};

/**
 * Get mock parameters to pass to a controller init function.
 *
 * @returns {Object}
 */
exports.getMockControllerParams = () => ({
	breadcrumbRoot: new Breadcrumb([
		{ name: 'Home', slug: '', path: '/' },
	]),
});
