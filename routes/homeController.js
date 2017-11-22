const set = require('lodash/fp/set');
const { getImageMeta } = require('../lib/imageUtils');
const data = require('../data/home');

module.exports = () => ({
	index: async (ctx) => {
		let dataForRender = data;
		const { pid } = ctx.query;

		// Set og:image to be the one from photoswipe gallery share if 'pid' is in URL query
		if (pid) {
			const imageIndex = Number(pid) - 1;
			const setOgImage = set(
				'meta.og.image',
				getImageMeta(data.projects[imageIndex].img.src).large,
			);
			dataForRender = setOgImage(data);
		}

		await ctx.render('home.pug', dataForRender);
	},
});
