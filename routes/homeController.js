const data = require('../data/home');

module.exports = () => ({
	index: async (ctx) => {
		await ctx.render('home.pug', data);
	},
});
