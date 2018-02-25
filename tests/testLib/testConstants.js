'use strict';

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
			'/sitemap',
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
	paths => paths.map(path => `${ORIGIN}${path}`),
);


// Pages to include in screenshot tests
//------------------------------
const SCREENSHOT_CONFIG = [
	{
		path: '/',
		shouldScrollPage: true,
		options: {
			fullPage: true,
		},
	},
	{
		// Page very long, just screenshot the top
		path: '/travel',
		shouldScrollPage: true,
	},
	{
		path: '/travel/slovakia',
		shouldScrollPage: true,
		options: {
			fullPage: true,
		},
	},
	{
		// This is a short article, so should take less time
		path: '/travel/slovakia/bratislava',
		shouldScrollPage: true,
		options: {
			fullPage: true,
		},
	},
	{
		// Photoswipe gallery
		path: '/travel/slovakia/bratislava#pid=2',
		shouldScrollPage: false,
	},
	{
		path: '/nonexistent-page',
		shouldScrollPage: true,
	},
	{
		path: '/sitemap',
		shouldScrollPage: false,
	},
].map(({ path, ...otherProps }) => ({
	url: `${ORIGIN}${path}`,
	path,
	...otherProps,
}));


// Credentials
//------------------------------
const CREDENTIALS = PASSWORD
	? { username: USERNAME, password: PASSWORD }
	: null;
const AUTH_HEADER = PASSWORD
	? `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')}`
	: undefined;


// Misc
//------------------------------
const MIN_STATIC_MAX_AGE = 2500000;


// Exports
//------------------------------
module.exports = {
	HOSTNAME,
	ORIGIN,
	CREDENTIALS,
	AUTH_HEADER,
	IS_PRODUCTION,
	PAGES,
	SCREENSHOT_CONFIG,
	MIN_STATIC_MAX_AGE,
};

assert(
	process.env.TEST_HOSTNAME,
	'TEST_HOSTNAME environment variable must be defined',
);
