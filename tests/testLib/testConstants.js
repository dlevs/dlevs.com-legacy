const assert = require('assert');
const mapValues = require('lodash/mapValues');


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
const absolute = path => `${ORIGIN}${path}`;


// Page URLs
//------------------------------
const PAGES = mapValues(
	{
		// Pages that represent an instance of each template.
		UNIQUE: [
			'/',
			'/travel',
			'/travel/ireland',
			'/travel/ireland/dublin',
		],
		// Pages on which to test JS features.
		WITH_READMORE: [
			'/',
		],
		WITH_PHOTOSWIPE: [
			'/',
			'/travel/ireland/dublin',
		],
	},
	paths => paths.map(absolute),
);


// Credentials
//------------------------------
const CREDENTIALS = PASSWORD
	? { username: USERNAME, password: PASSWORD }
	: null;
const AUTH_HEADER = PASSWORD
	? `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')}`
	: undefined;


// Exports
//------------------------------
module.exports = {
	HOSTNAME,
	ORIGIN,
	CREDENTIALS,
	AUTH_HEADER,
	IS_PRODUCTION,
	PAGES,
};

assert(
	process.env.TEST_HOSTNAME,
	'TEST_HOSTNAME environment variable must be defined',
);
