'use strict';

module.exports = ({ pages = [] }) => ({
	index: async (ctx) => {
		await ctx.render('sitemap.pug', { pages, origin: ctx.origin });
		ctx.type = 'xml';
	},
});
