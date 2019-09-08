'use strict';

import { getRevvedPath } from '/lib/assetUtils';
import { normalizePathToAbsolute, fetch } from './testLib/browserTestUtils';
const {
	PAGES,
	MIN_STATIC_MAX_AGE,
	MIN_HTML_MAX_AGE,
	MAX_HTML_MAX_AGE,
} = require('./testLib/browserTestConstants');


const pathsToCache = [
	getRevvedPath('/styles/main.css'),
	getRevvedPath('/scripts/main.js'),
	'/media/travel/ireland/dublin/20170923_145256_960x540.jpg',
	'/media/travel/ireland/dublin/20170923_145256_960x540.webp',
	'/apple-touch-icon.png',
	'/favicon.ico',
];

const pathsNotToCache = [
	'/info.json',
	'/sitemap.xml',
	'/robots.txt',
];

const testMaxAgeRange = (urls, min, max) => {
	urls
		.map(normalizePathToAbsolute)
		.forEach((url) => {
			test(url, async () => {
				const response = await fetch(url);
				expect(response).toMatchObject({ ok: true });

				const cacheControl = response.headers.get('Cache-Control');
				expect(cacheControl).not.toBe(null);

				const maxAgeString = cacheControl.replace('max-age=', '');
				const maxAge = Number(maxAgeString);

				if (min !== undefined) {
					expect(maxAge).toBeGreaterThan(min);
				}
				if (max !== undefined) {
					expect(maxAge).toBeLessThan(max);
				}
			});
		});
};

describe('Cache headers', () => {
	describe('are set in the correct range where expected', () => {
		testMaxAgeRange(pathsToCache, MIN_STATIC_MAX_AGE);
		// Pages have a short cache time that allows prefetching on link hover.
		testMaxAgeRange(PAGES.UNIQUE, MIN_HTML_MAX_AGE, MAX_HTML_MAX_AGE);
	});
	describe('are absent where expected', () => {
		const urls = pathsNotToCache.map(normalizePathToAbsolute);
		const expectedValues = [null, 'max-age=0'];

		urls.forEach((url) => {
			test(url, async () => {
				const response = await fetch(url);

				expect(response).toMatchObject({ ok: true });
				expect(expectedValues).toContain(response.headers.get('Cache-Control'));
			});
		});
	});
});
