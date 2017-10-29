const assert = require('assert');

// Environment variables
//------------------------------
const HOSTNAME = process.env.TEST_HOSTNAME;
const USERNAME = process.env.TEST_USERNAME;
const PASSWORD = process.env.TEST_PASSWORD;


// Environment
//------------------------------
const IS_STAGING = HOSTNAME.startsWith('staging.');
const IS_LOCALHOST = HOSTNAME.includes('localhost') || HOSTNAME.includes('127.0.0.1');
const IS_PRODUCTION = !IS_STAGING && !IS_LOCALHOST;


// URL structure
//------------------------------
const PROTOCOL = IS_LOCALHOST ? 'http' : 'https';
const ORIGIN = `${PROTOCOL}://${HOSTNAME}`;


// Page URLs
//------------------------------
const UNIQUE_PAGE_PATHS = [
	'/',
	'/travel',
	'/travel/ireland',
	'/travel/ireland/dublin'
];
const UNIQUE_PAGE_URLS = UNIQUE_PAGE_PATHS.map((path) => `${ORIGIN}${path}`);


// Credentials
//------------------------------
const CREDENTIALS = PASSWORD
	? {username: USERNAME, password: PASSWORD}
	: null;
const AUTH_HEADER = PASSWORD
	? 'Basic ' + new Buffer(`${USERNAME}:${PASSWORD}`).toString('base64')
	: undefined;


// Exports
//------------------------------
module.exports = {
	HOSTNAME,
	ORIGIN,
	UNIQUE_PAGE_URLS,
	CREDENTIALS,
	AUTH_HEADER,
	IS_PRODUCTION
};

assert(
	process.env.TEST_HOSTNAME,
	'TEST_HOSTNAME environment variable must be defined'
);
