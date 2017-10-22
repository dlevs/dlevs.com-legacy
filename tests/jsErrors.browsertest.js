const {UNIQUE_PAGE_URLS} = require('./testConstants');
const puppeteer = require('puppeteer');

describe('JavaScript errors', () => {
	test('are not detected', async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		let i = UNIQUE_PAGE_URLS.length;
		while (i--) {
			await page.goto(UNIQUE_PAGE_URLS[i]);
			const errors = await page.evaluate(() => {
				// Setup
				const photoswipe = document.querySelector('.js-photoswipe');
				const readmore = document.querySelector('.js-readmore-button');

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
