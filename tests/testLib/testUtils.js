'use strict';

/**
 * Execute a controller using mock data.
 * Return the data passed to template.
 *
 * @param {Function} controller
 * @param {Object} [params]
 * @returns {*}
 */
exports.getControllerRenderData = async (controller, params = {}) => {
	let renderedData;
	const ctx = {
		query: {},
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
