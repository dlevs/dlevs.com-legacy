'use strict';

const puppeteer = require('puppeteer');
const { fetch, testUrls } = require('../../tests/testLib/testUtils');
const { ORIGIN, CREDENTIALS } = require('../../tests/testLib/testConstants');

let browser;
beforeAll(async (done) => {
	browser = await puppeteer.launch();
	done();
});
afterAll(async (done) => {
	await browser.close();
	done();
});


describe('404 page', () => {
	const paths = [
		'/non-existent-page',

		// Test a page that is handled by koa-router.
		// Custom error page should show here too.
		'/travel/non-existent-page',
	];
	const urls = paths.map(path => `${ORIGIN}${path}`);

	testUrls(urls, {
		'has correct status code': async (url) => {
			const { ok, status } = await fetch(url);
			expect(ok).toBe(false);
			expect(status).toBe(404);
		},
		'has correct text': async (url) => {
			const page = await browser.newPage();
			await page.authenticate(CREDENTIALS);
			await page.goto(url);
			const {
				title,
				body,
				isDebugTextShowing,
			} = await page.evaluate(() => ({
				title: document.title,
				body: document.body.innerHTML,
				isDebugTextShowing: document.getElementsByTagName('pre').length > 0,
			}));

			expect(isDebugTextShowing).toBe(false);
			expect(title.toLowerCase()).toContain('not found');
			expect(body.toLowerCase()).toContain('not found');
		},
	});
});
