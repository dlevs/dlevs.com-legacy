const Router = require('koa-router');
const router = new Router();

require('./homeRoute')(router);
require('./travelRoute')(router);
require('./sitemapRoute')(router);
require('./robotsRoute')(router);

module.exports = router;
