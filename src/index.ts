/* eslint-disable import/first */

console.log('App starting...');

// TODO: Sort docker-compose local dev. docker provides these variables too. Do in one place
require('dotenv').config();

import path from 'path';
import Koa from 'koa';
// import serve from 'koa-static'); // TODO: Uninstall
import views from 'koa-views';
// import slash from 'koa-slash';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import errorMiddleware from '/middleware/errorMiddleware';
import redirectMiddleware from '/middleware/redirectMiddleware';
import serverPushMiddleware from '/middleware/serverPushMiddleware';
import securityHeadersMiddleware from '/middleware/securityHeadersMiddleware';
import setCtxStateMiddleware from '/middleware/setCtxStateMiddleware';
import router from '/routes';
import viewGlobals from '/lib/viewGlobals';

const app = new Koa();

// App sits behind an nginx server. Set proxy option to true
// to get koa to listen to X-Forwarded-Proto headers.
app.proxy = true;

app
	.use(errorMiddleware)
	// TODO: Do less server stuff here, and more with nginx
	// .use(slash())
	.use(redirectMiddleware)
	.use(bodyParser())
	.use(json({
		pretty: process.env.NODE_ENV !== 'production',
		param: 'pretty',
	}))
	.use(serverPushMiddleware)
	.use(securityHeadersMiddleware)
	.use(setCtxStateMiddleware)
	.use(views(path.join(__dirname, 'views'), { options: viewGlobals }))
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(process.env.PORT, () => {
		console.log(`App listening at http://localhost:${process.env.PORT}`);
	});

// Respond to external request to shut down server,
// for example on `docker-compose down`.
// TODO: Handle shutdown gracefully
process.on('SIGTERM', () => {
	process.exit(0);
});
