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

	await controller({
		query: {},
		...params,
		render(template, data) {
			renderedData = data;
		},
	});

	return renderedData;
};
