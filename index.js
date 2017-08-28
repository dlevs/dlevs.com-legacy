const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const slash = require('koa-slash');
const router = require('./routes');

const app = new Koa();

app
	.use(slash())
	.use(views(path.join(__dirname, 'views'), {extension: 'pug'}))
	.use(router.routes())
	.use(router.allowedMethods())
	.use(serve('./public'))
	.use(serve('./public_dist'))
	.listen(3000);
