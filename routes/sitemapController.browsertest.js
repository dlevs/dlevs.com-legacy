'use strict';

const puppeteer = require('puppeteer');
const uniqBy = require('lodash/uniqBy');
const { fetch, eachLimited } = require('../tests/testLib/testUtils');
const { ORIGIN, CREDENTIALS } = require('../tests/testLib/testConstants');

const imageUrlRegex = /\.(jpg|png)$/;

let links;

const getPageLinks = () => links.filter(({ type }) => type === 'page');
const getImageLinks = () => links.filter(({ type }) => type === 'image');

beforeAll(async (done) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.authenticate(CREDENTIALS);
	await page.goto(`${ORIGIN}/sitemap.xml`);
	links = await page.evaluate(() => Array
		.from(document.querySelectorAll('loc'))
		.map(({ prefix, textContent }) => ({
			url: textContent,
			type: prefix || 'page',
		})));
	await browser.close();
	done();
});

describe('/sitemap.xml', () => {
	test('response has correct MIME type', async () => {
		const response = await fetch(`${ORIGIN}/sitemap.xml`);
		const type = response.headers.get('content-type');

		expect(type).toBe('application/xml');
	});

	test('all links are https', async () => {
		expect(links.every(({ url }) => url.startsWith('https://'))).toBe(true);
	});

	describe('page links', () => {
		test('has page links', async () => {
			expect(getPageLinks().length).toBeGreaterThan(0);
		});
		test('has no duplicate page links', async () => {
			// Duplicates may not be invalid in sitemaps, but it suggests
			// possible URL collisions in the content.
			expect(uniqBy(getPageLinks(), 'url').length).toBe(getPageLinks().length);
		});
		test('all page links work', async () => {
			const pages = getPageLinks();

			eachLimited(pages, async ({ url }) => {
				const response = await fetch(url);
				expect(response).toMatchObject({ ok: true });
			});
		}, 20000);
	});

	describe('image links', () => {
		test('has image links', async () => {
			expect(getImageLinks().length).toBeGreaterThan(0);
		});
		test('image links have image extensions', async () => {
			expect(getImageLinks().every(({ url }) => imageUrlRegex.test(url))).toBe(true);
		});
		test('first 5 images work', async () => {
			const images = getImageLinks().slice(0, 5);

			eachLimited(images, async ({ url }) => {
				const response = await fetch(url);
				expect(response).toMatchObject({ ok: true });
			});
		}, 20000);
	});
});
