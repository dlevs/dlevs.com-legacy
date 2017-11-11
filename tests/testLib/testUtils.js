const { promisify } = require('util');
const tough = require('tough-cookie');
const rawFetch = require('node-fetch');
const eachLimit = promisify(require('async').eachLimit);
const { ORIGIN, HOSTNAME, AUTH_HEADER } = require('./testConstants');

/**
 * When testing external links, some set cookies in redirects. node-fetch
 * must be wrapped to support this, otherwise will error out because of too
 * many redirects
 *
 * @param {String} url
 * @param {Object} [options]
 */
const externalFetch = require('fetch-cookie/node-fetch')(
	rawFetch,
	new tough.CookieJar(undefined, {
		rejectPublicSuffixes: false,
		looseMode: true,
	}),
);

/**
 * Wrapper around node-fetch that will set authorisation headers, allowing
 * password-protected site instances, like staging, to be tested.
 *
 * @param {String} url
 * @param {Object} [options]
 */
const internalFetch = (url, options) =>
	rawFetch(
		url,
		{
			...options,
			headers: {
				...options.headers,
				Authorization: AUTH_HEADER,
			},
		},
	);

/**
 * Wrapper around node fetch to apply headers and cookie handling as needed.
 *
 * @param {String} url
 * @param {Object} [options]
 */
exports.fetch = (url, options = {}) =>
	(url.includes(HOSTNAME)
		? internalFetch(url, options)
		: externalFetch(url, options));

/**
 * Helper to remove need for lots of boilerplate loops when repeating tests for
 * multiple URLs.
 *
 * The keys in the `tests` object describe what the tests are for.
 *
 * @param {String} urls
 * @param {Object} tests
 */
exports.testUrls = (urls, tests) => {
	Object.entries(tests).forEach(([testDescription, testFn]) => {
		describe(testDescription, () => {
			urls.forEach((url) => {
				test(url, testFn(url));
			});
		});
	});
};

/**
 * Like Promise.all, but limited to reduce parallel tasks/ network requests.
 *
 * @param {Array} items
 * @param {Function<Promise>} cb
 */
exports.eachLimited = (items, cb) => eachLimit(items, 8, cb);

/**
 * Prepend URL paths with origin if it does not already exist.
 *
 * @param {String} path
 * @returns {String}
 */
exports.normalizePathToAbsolute = (path) => {
	if (path.startsWith('http')) {
		return path;
	}

	return `${ORIGIN}${path}`;
};
