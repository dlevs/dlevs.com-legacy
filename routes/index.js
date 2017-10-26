// Dependencies
//------------------------------------
const Router = require('koa-router');
const router = new Router();


// Variables
//------------------------------------
const BREADCRUMB_ROOT = [{label: 'Home'}];
const TRAVEL_BLOG_SLUG = 'travel';


// Controllers
//------------------------------------
const homeController = require('./homeController')();
const robotsController = require('./robotsController')();
const travelController = require('./travelController')({
	breadcrumbRoot: [
		...BREADCRUMB_ROOT,
		{
			label: 'Travel',
			slug: TRAVEL_BLOG_SLUG
		}
	]
});
const sitemapController = require('./sitemapController')({
	pages: [
		{path: '/'},
		{path: `/${TRAVEL_BLOG_SLUG}`},
		...travelController.sitemap
	]
});
const infoController = require('./infoController')();
const reportingController = require('./reportingController')();


// Routes
//------------------------------------
router
	// Home
	.get('/', homeController.index)

	// Travel blog
	.get(`/${TRAVEL_BLOG_SLUG}`, travelController.index)
	.get(`/${TRAVEL_BLOG_SLUG}/:countrySlug`, travelController.renderPostsForCountry)
	.get(`/${TRAVEL_BLOG_SLUG}/:countrySlug/:townSlug`, travelController.renderPost)

	// Meta
	.get('/info.json', infoController.index)
	.get('/robots.txt', robotsController.index)
	.get('/sitemap.xml', sitemapController.index)

	// Reporting
	.post('/report-csp-violation', reportingController.reportCSPViolation);


// Exports
//------------------------------------
module.exports = router;
