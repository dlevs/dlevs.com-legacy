const Router = require('koa-router');
const router = new Router();

require('./homeRoute')(router);
require('./travelRoute')(router);

module.exports = router;
