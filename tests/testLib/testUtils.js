const tough = require('tough-cookie');
const rawFetch = require('node-fetch');
const {HOSTNAME, AUTH_HEADER} = require('./testConstants');

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
		looseMode: true
	})
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
				Authorization: AUTH_HEADER
			}
		}
	);

/**
 * Wrapper around node fetch to apply headers and cookie handling as needed.
 *
 * @param {String} url
 * @param {Object} [options]
 */
exports.fetch = (url, options = {}) =>
	url.includes(HOSTNAME)
		? internalFetch(url, options)
		: externalFetch(url, options);
