const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const slash = require('koa-slash');
const router = require('./routes');
const IMAGE_META = require('./images/meta');

const app = new Koa();

app
	.use(slash())
	.use(views(path.join(__dirname, 'views'), {
		extension: 'pug',
		// Using "options" object to set local variables in templates
		options: {IMAGE_META}
	}))
	.use(router.routes())
	.use(router.allowedMethods())
	.use(serve(path.join(__dirname, './public')))
	.use(serve(path.join(__dirname, './public-dist')))
	.listen(3000);
