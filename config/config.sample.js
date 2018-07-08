'use strict';

const { SECONDS_IN_A_DAY } = require('../lib/constants');

exports.setProcessEnv = () => {
	process.env.NODE_ENV = 'development';
};
exports.PORT = 3000;
exports.GOOGLE_ANALYTICS_ID = 'UA-57421315-4';
exports.IS_BEHIND_PROXY = true;
exports.HOSTNAME = `localhost:${exports.PORT}`;
exports.ORIGIN = `http://${exports.HOSTNAME}`;
exports.STATIC_ASSET_MAX_AGE_IN_SECONDS = 0 * SECONDS_IN_A_DAY;
