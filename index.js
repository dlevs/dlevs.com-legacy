// TODO: Sort docker-compose local dev. docker provides these variables too. Do in one place
require('dotenv').config();

const path = require('path');
const Koa = require('koa');
// const serve = require('koa-static'); // TODO: Uninstall
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
app.proxy = true;

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
	.listen(process.env.PORT);

// Respond to external request to shut down server,
// for example on `docker-compose down`.
// This app has no cleanup to perform so no need to be graceful.
process.on('SIGTERM', () => {
	process.exit(0);
});
