const Router = require('koa-router');
const router = new Router();

require('./homeRoute')(router);
require('./travelRoute')(router);
require('./sitemap')(router);
require('./robots')(router);

module.exports = router;
