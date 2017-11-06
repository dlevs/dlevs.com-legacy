const puppeteer = require('puppeteer');
const { PAGES, CREDENTIALS } = require('./testLib/testConstants');

describe('JavaScript errors', () => {
	test('are detected when they occur', async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.authenticate(CREDENTIALS);

		let i = PAGES.UNIQUE.length;
		while (i--) {
			await page.goto(PAGES.UNIQUE[i]);
			await page.evaluate(() => {
				const script = document.createElement('script');
				script.innerHTML = 'SOMETHING_NON_EXISTENT';
				document.body.appendChild(script);
			});
			const errors = await page.evaluate(() => window.ERRORS);
			expect(errors.length).toBeGreaterThan(0);
		}

		await browser.close();
	}, 40000);

	test('are not detected unexpectedly', async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.authenticate(CREDENTIALS);

		let i = PAGES.UNIQUE.length;
		while (i--) {
			await page.goto(PAGES.UNIQUE[i]);
			const errors = await page.evaluate(() => {
				// Setup
				const photoswipe = document.querySelector('.js-photoswipe');
				const readmore = document.querySelector('.readmore__checkbox');

				// If features exist on page, trigger them to check they do not
				// cause errors.
				if (photoswipe) photoswipe.click();
				if (readmore) readmore.click();

				return window.ERRORS;
			});
			expect(errors.length).toBe(0);
		}

		await browser.close();
	}, 40000);
});
