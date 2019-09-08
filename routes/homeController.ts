import { Context } from 'koa';
import { getMediaMeta } from '/lib/mediaUtils';
import data from '/data/home';

export default () => ({
	index: async (ctx: Context) => {
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
							'og:image': getMediaMeta(project.img.src).versions.large,
							'og:image:alt': project.img.alt,
						},
					},
				};
			}
		}

		await ctx.render('home.pug', dataForRender);
	},
});
