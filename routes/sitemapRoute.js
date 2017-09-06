const travelPosts = require('../data/travelPosts');

const getParentPaths = (path) => {
	const parent = path.split('/').slice(0, -1).join('/');

	if (parent === '') {
		return [];
	}

	return getParentPaths(parent).concat(parent);
};

const getAllParentRoutes = (items) => {
	const paths = items.reduce((acc, item) => {
		return acc.concat(getParentPaths(item.href));
	}, []);
	const uniquePaths = new Set(paths);

	// TODO: Change 'href' to 'path
	return Array.from(uniquePaths).map(href => ({href}));
};

module.exports = (router) => {

	router.get('/sitemap.xml', async (ctx) => {
		await ctx.render('sitemap', {
			pages: []
				.concat({href: '/'})
				.concat(getAllParentRoutes(travelPosts))
				.concat(travelPosts),
			origin: ctx.origin
		});
		ctx.type = 'text/xml';
	});

};
