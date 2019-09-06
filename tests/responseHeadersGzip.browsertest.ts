'use strict';

// TODO: All these tests add an insane weight to this project. They could be covered by a generic website test lib

const { getRevvedPath } = require('/lib/assetUtils');
const { PAGES } = require('./testLib/browserTestConstants');
const { normalizePathToAbsolute, fetch } = require('./testLib/browserTestUtils');


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
	'/media/travel/ireland/dublin/20170923_145256_960x540.jpg',
	'/media/travel/ireland/dublin/20170923_145256_960x540.webp',
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
