const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const slash = require('koa-slash');
const router = require('./routes');
const IMAGE_META = require('./data/generated/images');
const ASSET_META = require('./data/generated/assets');
const ICONS = require('feather-icons');

const app = new Koa();

// App sits behind an nginx server. Set proxy option to true
// to get koa to listen to X-Forwarded-Proto headers.
// TODO: move to env?
app.proxy = true;

app
	.use(slash())
	.use(views(path.join(__dirname, 'views'), {
		extension: 'pug',
		// Using "options" object to set local variables in templates
		options: {IMAGE_META, ASSET_META, ICONS}
	}))
	.use(router.routes())
	.use(router.allowedMethods())
	.use(serve(path.join(__dirname, './public')))
	.use(serve(path.join(__dirname, './public-dist')))
	.listen(process.env.PORT || 3000);
