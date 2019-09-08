// TODO: Sort docker-compose local dev. docker provides these variables too. Do in one place
// require('dotenv').config();
import path from 'path';
import Koa from 'koa';
// import serve from 'koa-static'); // TODO: Uninstall
import views from 'koa-views';
// import slash from 'koa-slash';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import errorMiddleware from '@root/middleware/errorMiddleware';
import redirectMiddleware from '@root/middleware/redirectMiddleware';
import serverPushMiddleware from '@root/middleware/serverPushMiddleware';
import securityHeadersMiddleware from '@root/middleware/securityHeadersMiddleware';
import setCtxStateMiddleware from '@root/middleware/setCtxStateMiddleware';
import router from '@root/routes';
import viewGlobals from '@root/lib/viewGlobals';

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
	.listen(process.env.PORT);

// Respond to external request to shut down server,
// for example on `docker-compose down`.
// This app has no cleanup to perform so no need to be graceful.
process.on('SIGTERM', () => {
	process.exit(0);
});
