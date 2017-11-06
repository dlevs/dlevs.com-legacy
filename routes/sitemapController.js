module.exports = ({ pages = [] }) => ({
	index: async (ctx) => {
		await ctx.render('sitemap', { pages, origin: ctx.origin });
		ctx.type = 'xml';
	},
});
