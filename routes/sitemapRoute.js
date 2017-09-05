const travelPosts = require('../data/travelPosts');

module.exports = (router) => {

	router.get('/sitemap.xml', async (ctx) => {
		const homePage = {href: '/'};
		const travelPostsPages = travelPosts.map(({href, mainImage}) => ({
			href,
			imageSrc: mainImage.src
		}));
		const allPages = []
			.concat(homePage)
			.concat(travelPostsPages)
			.map(({href, imageSrc, ...otherProps}) => ({
				href: ctx.origin + href,
				imageSrc: imageSrc ? ctx.origin + imageSrc : undefined,
				...otherProps
			}));

		await ctx.render('sitemap', {pages: allPages});
		ctx.type = 'text/xml';
	});

};
