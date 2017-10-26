const {
	setProcessEnv,
	PORT,
	GOOGLE_ANALYTICS_ID,
	IS_BEHIND_PROXY
} = require('./config');

setProcessEnv();

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const slash = require('koa-slash');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const errorMiddleware = require('./lib/middleware/errorMiddleware');
const serverPushMiddleware = require('./lib/middleware/serverPushMiddleware');
const router = require('./routes');
const IMAGE_META = require('./data/generated/images');
const CONSTANTS = require('./lib/constants');
const GET_REVVED_PATH = require('./lib/getRevvedPath');
const ICONS = require('feather-icons');

const app = new Koa();

// App sits behind an nginx server. Set proxy option to true
// to get koa to listen to X-Forwarded-Proto headers.
app.proxy = IS_BEHIND_PROXY;

app
	.use(errorMiddleware)
	.use(serverPushMiddleware)
	.use(bodyParser())
	.use(helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: [
					"'self'",
					// It would be nice to block inline scripts / styles, but
					// it's more likely to introduce bugs than prevent a real
					// XSS threat on this site.
					"'unsafe-inline'",
					// Analytics scripts
					'https://www.googletagmanager.com',
					'https://www.google-analytics.com'
				],
				styleSrc: [
					"'self'",
					"'unsafe-inline'"
				],
				imgSrc: [
					"'self'",
					'data:',
					// Analytics scripts
					'https://www.google-analytics.com'
				],
				reportUri: '/report-csp-violation'
			},
			// Requests are cached. Don't base anything off browser.
			browserSniff: false
		},
		referrerPolicy: {policy: 'same-origin'}
	}))
	.use(slash())
	.use(views(path.join(__dirname, 'views'), {
		extension: 'pug',
		// Using "options" object to set local variables in templates
		options: {
			IMAGE_META,
			GET_REVVED_PATH,
			ICONS,
			GOOGLE_ANALYTICS_ID,
			CONSTANTS,
			DEBUG: process.env.NODE_ENV !== 'production'
		}
	}))
	.use(router.routes())
	.use(router.allowedMethods())
	.use(serve(path.join(__dirname, './public')))
	.use(serve(path.join(__dirname, './public-dist')))
	.listen(PORT);
