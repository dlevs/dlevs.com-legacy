// TODO: Sort docker-compose local dev. docker provides these variables too. Do in one place
// require('dotenv').config();

import path from 'path';
import Koa from 'koa';
// import serve from 'koa-static'); // TODO: Uninstal
import views from 'koa-views';
import slash from 'koa-slash';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import errorMiddleware from './lib/middleware/errorMiddleware';
import redirectMiddleware from './lib/middleware/redirectMiddleware';
import serverPushMiddleware from './lib/middleware/serverPushMiddleware';
import securityHeadersMiddleware from './lib/middleware/securityHeadersMiddleware';
import setCtxStateMiddleware from './lib/middleware/setCtxStateMiddleware';
import router from './routes';
import viewGlobals from './lib/viewGlobals';

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
