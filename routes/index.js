'use strict';

// Dependencies
//------------------------------------
const Router = require('koa-router');

const router = new Router();


// Variables
//------------------------------------
const BREADCRUMB_ROOT = [{ label: 'Home' }];
const TRAVEL_BLOG_SLUG = 'travel';
const PATTERN_LIBRARY_SLUG = 'pattern-library';


// Controllers
//------------------------------------
const homeController = require('./homeController')();
const robotsController = require('./robotsController')();
const travelController = require('./travelController')({
	breadcrumbRoot: [
		...BREADCRUMB_ROOT,
		{
			label: 'Travel',
			slug: TRAVEL_BLOG_SLUG,
		},
	],
});
const patternLibraryController = require('./patternLibraryController')({
	breadcrumbRoot: [
		...BREADCRUMB_ROOT,
		{
			label: 'Pattern Library',
			slug: PATTERN_LIBRARY_SLUG,
		},
	],
	rootPath: `/${PATTERN_LIBRARY_SLUG}`,
});
const sitemapController = require('./sitemapController')({
	pages: [
		{ path: '/' },
		{ path: `/${TRAVEL_BLOG_SLUG}` },
		...travelController.sitemap,
	],
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
	.get(`/${PATTERN_LIBRARY_SLUG}`, patternLibraryController.index)
	.get(`/${PATTERN_LIBRARY_SLUG}/:slug`, patternLibraryController.index)
	.get('/info.json', infoController.index)
	.get('/robots.txt', robotsController.index)
	.get('/sitemap.xml', sitemapController.index)

	// Reporting
	.post('/report-csp-violation', reportingController.reportCSPViolation);


// Exports
//------------------------------------
module.exports = router;
