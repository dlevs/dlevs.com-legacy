const { getRevvedPath } = require('../lib/assetUtils');
const { PAGES, MIN_STATIC_MAX_AGE } = require('./testLib/testConstants');
const { normalizePathToAbsolute, fetch } = require('./testLib/testUtils');


const pathsToCache = [
	getRevvedPath('/styles/main.css'),
	getRevvedPath('/scripts/main.js'),
	'/images/travel/ireland/20170923_145256.jpg',
	'/images/travel/ireland/20170923_145256_960x540.webp',
	'/apple-touch-icon.png',
	'/favicon.ico',
];

const pathsNotToCache = PAGES.UNIQUE.concat([
	'/info.json',
	'/sitemap.xml',
	'/robots.txt',
]);


describe('Cache headers', () => {
	describe('are set where expected', () => {
		const urls = pathsToCache.map(normalizePathToAbsolute);

		urls.forEach((url) => {
			test(url, async () => {
				const response = await fetch(url);

				expect(response).toMatchObject({ ok: true });

				const maxAgeString = response.headers.get('Cache-Control').replace('max-age=', '');
				const maxAge = Number(maxAgeString);
				expect(maxAge).toBeGreaterThan(MIN_STATIC_MAX_AGE);
			});
		});
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
