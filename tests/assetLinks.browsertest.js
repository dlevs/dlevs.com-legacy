const {PAGES, ORIGIN, CREDENTIALS} = require('./testLib/testConstants');
const {fetch} = require('./testLib/testUtils');
const puppeteer = require('puppeteer');
const {URL} = require('url');


describe('Links and static resources', () => {
	test('exist and return an OK status code', async () => {
		const ignoreList = [
			// LinkedIn returns status 999 "Request denied" for non-browser
			'https://www.linkedin.com/in/daniellevett/'
		];
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.authenticate(CREDENTIALS);

		let assets = [];
		let i = PAGES.UNIQUE.length;
		while (i--) {
			await page.goto(PAGES.UNIQUE[i]);

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
