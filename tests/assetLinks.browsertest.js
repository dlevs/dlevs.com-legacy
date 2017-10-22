const {UNIQUE_PAGE_URLS, ORIGIN} = require('./testConstants');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const {URL} = require('url');


describe('Links and static resources', () => {
	test('exist and return an OK status code', async () => {
		// Some sites have auth issues
		const ignoreList = [
			'https://www.linkedin.com/in/daniellevett/'
		];
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		let assets = [];

		let i = UNIQUE_PAGE_URLS.length;
		while (i--) {
			await page.goto(UNIQUE_PAGE_URLS[i]);
			const newAssets = await page.evaluate(() => {
				const $ = (selector) => Array.from(document.querySelectorAll(selector));
				return []
					.concat($('[href]').map(({href}) => href))
					.concat($('[src]').map(({src}) => src))
					.concat($('[data-href-webp]').map(({dataset}) => dataset.hrefWebp));
			});
			assets = assets.concat(newAssets);
		}
		await browser.close();

		assets = Array
			// Remove duplicates
			.from(new Set(assets))
			// Remove unwanted URLS
			.filter((url) => !url.startsWith('data:'))
			.filter((url) => !ignoreList.includes(url))
			// If link is from data attribute instead of "src" or "href",
			// browser does not expand to be an absolute URL. Do this manually.
			.map((url) => {
				if (url.startsWith('http')) {
					return url;
				} else {
					return new URL(url, ORIGIN).toString()
				}
			});

		expect(assets.length).toBeGreaterThan(0);
		expect(assets.every(
			(value) => typeof value === 'string'
		)).toBe(true);


		let a = assets.length;
		while (a--) {
			const response = await fetch(assets[a]);
			expect(response).toMatchObject({ok: true});
		}
	}, 60000);
});
