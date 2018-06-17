'use strict';

const { getMediaMeta } = require('../lib/mediaUtils');
const data = require('../data/home');

module.exports = () => ({
	index: async (ctx) => {
		let dataForRender = data;
		const { pid } = ctx.query;

		// Set og:image and page description to be the one from photoswipe
		// gallery share if 'pid' is in URL query
		if (pid) {
			const imageIndex = Number(pid) - 1;
			const project = data.projects[imageIndex];
			if (project) {
				dataForRender = {
					...dataForRender,
					meta: {
						...dataForRender.meta,
						description: project.heading,
						og: {
							...dataForRender.meta.og,
							image: getMediaMeta(project.img.src).versions.large,
						},
					},
				};
			}
		}

		await ctx.render('home.pug', dataForRender);
	},
});
