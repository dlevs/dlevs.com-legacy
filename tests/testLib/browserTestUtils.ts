'use strict';

import { promisify } from 'util';
import tough from 'tough-cookie';
import rawFetch from 'node-fetch';
const eachLimit = promisify(require('async').eachLimit);
import { ORIGIN, HOSTNAME, AUTH_HEADER } from './browserTestConstants';

/**
 * When testing external links, some set cookies in redirects. node-fetch
 * must be wrapped to support this, otherwise will error out because of too
 * many redirects.
 */
import externalFetch from 'fetch-cookie/node-fetch'(
	rawFetch,
	new tough.CookieJar(undefined, {
		rejectPublicSuffixes: false,
		looseMode: true,
	}),
);

/**
 * Wrapper around node-fetch that will set authorisation headers, allowing
 * password-protected site instances, like staging, to be tested.
 */
const internalFetch = (url: string, options) =>
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
 */
export const fetch = (url, options = {}) =>
	(url.includes(HOSTNAME)
		? internalFetch(url, options)
		: externalFetch(url, options));

/**
 * Helper to remove need for lots of boilerplate loops when repeating tests for
 * multiple URLs.
 *
 * The keys in the `tests` object describe what the tests are for.
 */
export const testUrls = (urls, tests) => {
	Object.entries(tests).forEach(([testDescription, testFn]) => {
		describe(testDescription, () => {
			urls.forEach((url) => {
				test(url, () => testFn(url));
			});
		});
	});
};

/**
 * Like Promise.all, but limited to reduce parallel tasks/ network requests.
 */
export const eachLimited = (items, cb) => eachLimit(items, 8, cb);

/**
 * Prepend URL paths with origin if it does not already exist.
 */
export const normalizePathToAbsolute = (path) => {
	if (path.startsWith('http')) {
		return path;
	}

	return `${ORIGIN}${path}`;
};

/**
 * Return true if the user is scrolled to the bottom of the page.
 */
const isPageScrolledToBottom = () =>
	document.documentElement.scrollHeight === Math.ceil(window.scrollY + window.innerHeight);


/**
 * For a Puppeteer page instance, scroll to the bottom of the page.
 * Useful for triggering lazyloading features.
 */
export const scrollPage = async (page) => {
	await page.evaluate(() => {
		window.scroll({
			top: document.documentElement.scrollHeight - window.innerHeight,
			left: 0,
			behavior: 'smooth',
		});
	});
	await page.waitForFunction(isPageScrolledToBottom);

	// Now scroll up so we can take screenshots of top of page in fullPage mode.
	await page.evaluate(() => {
		window.scroll({ top: 0, left: 0 });
	});

	// Allow time for images to load
	await page.waitFor(1000);
};
