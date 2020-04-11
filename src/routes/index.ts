import Router from 'koa-router';
import Breadcrumb from '/lib/Breadcrumb';
import initHomeController from './homeController';
import initRobotsController from './robotsController';
import initInfoController from './infoController';
import initReportingController from './reportingController';
import initTravelController from './travelController';
import initPatternLibraryController from './patternLibraryController';
import initSitemapController from './sitemapController';

// Variables
//------------------------------------
const router = new Router();
const ROOT_PAGE = { name: 'Home', slug: '', path: '/' };
const controllerParams = { breadcrumbRoot: new Breadcrumb([ROOT_PAGE]) };

// Controllers
//------------------------------------
const homeController = initHomeController();
const robotsController = initRobotsController();
const infoController = initInfoController();
const reportingController = initReportingController();
const travelController = initTravelController(controllerParams);
const patternLibraryController = initPatternLibraryController(controllerParams);
const sitemapController = initSitemapController({
	...controllerParams,
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
	.use(travelController.router.allowedMethods())

	// Pattern library
	.use(patternLibraryController.router.routes())
	.use(patternLibraryController.router.allowedMethods())

	// Sitemap
	.use(sitemapController.router.routes())
	.use(sitemapController.router.allowedMethods())

	// Meta
	.get('/info.json', infoController.index)
	.get('/robots.txt', robotsController.index)

	// Reporting
	.post('/report-csp-violation', reportingController.reportCSPViolation);

// Exports
//------------------------------------
export default router;
