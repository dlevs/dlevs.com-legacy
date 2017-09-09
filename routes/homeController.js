const data = require('../data/home.json');

module.exports = () => ({
	index: async (ctx) => {
		await ctx.render('home', data);
	}
});
