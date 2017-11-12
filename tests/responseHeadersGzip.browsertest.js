const { getRevvedPath } = require('../lib/assetUtils');
const { PAGES } = require('./testLib/testConstants');
const { normalizePathToAbsolute, fetch } = require('./testLib/testUtils');


const pathsToGzip = PAGES.UNIQUE.concat([
	getRevvedPath('/styles/main.css'),
	getRevvedPath('/scripts/main.js'),
	'/info.json',
	'/manifest.json',
	'/sitemap.xml',
	'/robots.txt',
	'/favicon.ico',
]);

const pathsNotToGzip = [
	'/images/travel/ireland/20170923_145256.jpg',
	'/images/travel/ireland/20170923_145256_960x540.webp',
	'/apple-touch-icon.png',
];


describe('Gzip compression', () => {
	describe('is set where expected', () => {
		const urls = pathsToGzip.map(normalizePathToAbsolute);

		urls.forEach((url) => {
			test(url, async () => {
				const response = await fetch(url);

				expect(response).toMatchObject({ ok: true });
				expect(response.headers.get('Content-Encoding')).toBe('gzip');
			});
		});
	});
	describe('is absent where expected', () => {
		const urls = pathsNotToGzip.map(normalizePathToAbsolute);

		urls.forEach((url) => {
			test(url, async () => {
				const response = await fetch(url);

				expect(response).toMatchObject({ ok: true });
				expect(response.headers.get('Content-Encoding')).not.toBe('gzip');
			});
		});
	});
});
