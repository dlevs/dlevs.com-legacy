'use strict';

// Dependencies
//------------------------------------
const Router = require('koa-router');


// Variables
//------------------------------------
const router = new Router();
const ROOT_PAGE = { name: 'Home', path: '/' };
const controllerParams = { breadcrumbRoot: [ROOT_PAGE] };


// Controllers
//------------------------------------
const homeController = require('./homeController')();
const robotsController = require('./robotsController')();
const infoController = require('./infoController')();
const reportingController = require('./reportingController')();
const travelController = require('./travelController')(controllerParams);
const patternLibraryController = require('./patternLibraryController')(controllerParams);
const sitemapController = require('./sitemapController')({
	pages: [
		ROOT_PAGE,
		travelController.sitemap,
		patternLibraryController.sitemap,
	],
});


// Routes
//------------------------------------
router
	// Home
	.get('/', homeController.index)

	// Travel blog
	.use(travelController.router.routes())

	// Meta
	.use(patternLibraryController.router.routes())
	.get('/info.json', infoController.index)
	.get('/robots.txt', robotsController.index)
	.get('/sitemap', sitemapController.html)
	.get('/sitemap.xml', sitemapController.xml)

	// Reporting
	.post('/report-csp-violation', reportingController.reportCSPViolation);


// Exports
//------------------------------------
module.exports = router;
