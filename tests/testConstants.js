const assert = require('assert');

assert(
	process.env.TEST_HOSTNAME,
	'TEST_HOSTNAME environment variable must be defined'
);

const UNIQUE_PAGE_PATHS = [
	'/',
	'/travel',
	'/travel/ireland',
	'/travel/ireland/dublin'
];

exports.HOSTNAME = process.env.TEST_HOSTNAME;
exports.ORIGIN = `https://${exports.HOSTNAME}`;
exports.UNIQUE_PAGE_URLS = UNIQUE_PAGE_PATHS.map(
	(path) => `${exports.ORIGIN}${path}`
);
