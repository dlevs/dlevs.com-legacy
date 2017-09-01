const Router = require('koa-router');
const router = new Router();

require('./home')(router);
require('./travel')(router);

module.exports = router;
