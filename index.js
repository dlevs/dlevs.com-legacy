// @flow
const { setProcessEnv, PORT, IS_BEHIND_PROXY } = require('./config');

setProcessEnv();

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const slash = require('koa-slash');
const bodyParser = require('koa-bodyparser');
const errorMiddleware = require('./lib/middleware/errorMiddleware');
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
	.use(bodyParser())
	.use(slash())
	.use(serverPushMiddleware)
	.use(securityHeadersMiddleware)
	.use(setCtxStateMiddleware)
	.use(views(path.join(__dirname, 'views'), {
		extension: 'pug',
		options: viewGlobals,
	}))
	.use(router.routes())
	.use(router.allowedMethods())
	.use(serve(path.join(__dirname, './public')))
	.use(serve(path.join(__dirname, './publicDist')))
	.listen(PORT);
