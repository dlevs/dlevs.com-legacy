const data = require('../data/home.json');

module.exports = (router) => {

	router.get('/', async (ctx) => {
		await ctx.render('home', data)
	});

};
