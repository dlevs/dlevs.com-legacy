const travelPosts = require('../data/travel/posts');
const travelPostsByCountry = require('../data/travel/postsByCountry');

module.exports = (router) => {

	router.get('/sitemap.xml', async (ctx) => {
		await ctx.render('sitemap', {
			pages: []
				// root
				.concat({href: '/'})

				// travel
				.concat({href: '/travel'})
				.concat(travelPostsByCountry)
				.concat(travelPosts),

			origin: ctx.origin
		});
		ctx.type = 'text/xml';
	});

};
