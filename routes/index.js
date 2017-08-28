const Router = require('koa-router');
const router = new Router();

require('./home')(router);
require('./blog')(router);

module.exports = router;
