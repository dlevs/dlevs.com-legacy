'use strict';

const {
	setProcessEnv,
	PORT,
	IS_BEHIND_PROXY,
	// STATIC_ASSET_MAX_AGE_IN_SECONDS,
} = require('./config');

setProcessEnv();

const path = require('path');
const Koa = require('koa');
// const serve = require('koa-static');
const views = require('koa-views');
const slash = require('koa-slash');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const errorMiddleware = require('./lib/middleware/errorMiddleware');
const redirectMiddleware = require('./lib/middleware/redirectMiddleware');
const serverPushMiddleware = require('./lib/middleware/serverPushMiddleware');
const securityHeadersMiddleware = require('./lib/middleware/securityHeadersMiddleware');
const setCtxStateMiddleware = require('./lib/middleware/setCtxStateMiddleware');
const router = require('./routes');
const viewGlobals = require('./lib/viewGlobals');

const app = new Koa();

// App sits behind an nginx server. Set proxy option to true
// to get koa to listen to X-Forwarded-Proto headers.
app.proxy = IS_BEHIND_PROXY;

app
	.use(errorMiddleware)
	.use(slash())
	// TODO: Do less server stuff here, and more with nginx
	.use(redirectMiddleware)
	.use(bodyParser())
	.use(json({
		pretty: process.env.NODE_ENV !== 'production',
		param: 'pretty',
		spaces: '\t',
	}))
	.use(serverPushMiddleware)
	.use(securityHeadersMiddleware)
	.use(setCtxStateMiddleware)
	.use(views(path.join(__dirname, 'views'), { options: viewGlobals }))
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(PORT);
