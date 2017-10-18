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
const errorMiddleware = require('./lib/middleware/errorMiddleware');
const serverPushMiddleware = require('./lib/middleware/serverPushMiddleware');
const router = require('./routes');
const IMAGE_META = require('./data/generated/images');
const ASSET_META = require('./data/generated/assets.json');
const CONSTANTS = require('./lib/constants');
const ICONS = require('feather-icons');

const app = new Koa();

// App sits behind an nginx server. Set proxy option to true
// to get koa to listen to X-Forwarded-Proto headers.
app.proxy = IS_BEHIND_PROXY;

// TODO: Move me
const proxy = new Proxy({}, {
	get: (target, name) => name
});

app
	.use(errorMiddleware)
	.use(serverPushMiddleware)
	.use(revAssetsMiddleware)
	.use(slash())
	.use(views(path.join(__dirname, 'views'), {
		extension: 'pug',
		// Using "options" object to set local variables in templates
		options: {
			IMAGE_META,
			ASSET_META: process.env.NODE_ENV !== 'production' ? ASSET_META : proxy,
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
