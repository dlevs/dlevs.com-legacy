const puppeteer = require('puppeteer');
const {fetch} = require('../../tests/testLib/testUtils');
const {ORIGIN, CREDENTIALS} = require('../../tests/testLib/testConstants');


describe('404 page', () => {
	const paths = [
		'/non-existent-page',

		// Test a page that is handled by koa-router.
		// Custom error page should show here too.
		'/travel/non-existent-page'
	];
	let i = paths.length;

	while (i--) {
		const url = `${ORIGIN}${paths[i]}`;

		describe(url, () => {
			test('has correct status code', async () => {
				const {ok, status} = await fetch(url);
				expect(ok).toBe(false);
				expect(status).toBe(404)
			});
			test('has correct text', async () => {
				const browser = await puppeteer.launch();
				const page = await browser.newPage();
				await page.authenticate(CREDENTIALS);
				await page.goto(url);
				const {
					title,
					body,
					isDebugTextShowing
				} = await page.evaluate(() => {
					return {
						title: document.title,
						body: document.body.innerHTML,
						isDebugTextShowing: document.getElementsByTagName('pre').length > 0
					}
				});
				await browser.close();

				expect(isDebugTextShowing).toBe(false);
				expect(title.toLowerCase()).toContain('not found');
				expect(body.toLowerCase()).toContain('not found');
			});
		});
	}
});
