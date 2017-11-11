const puppeteer = require('puppeteer');
const { PAGES, CREDENTIALS } = require('./testLib/testConstants');

let browser;
beforeAll(async (done) => {
	browser = await puppeteer.launch();
	done();
});
afterAll(async (done) => {
	await browser.close();
	done();
});


describe('JavaScript errors', () => {
	test('are detected when they occur', async () => {
		await Promise.all(PAGES.UNIQUE.map(async (url) => {
			const page = await browser.newPage();
			await page.authenticate(CREDENTIALS);
			await page.goto(url);
			await page.evaluate(() => {
				const script = document.createElement('script');
				script.innerHTML = 'SOMETHING_NON_EXISTENT';
				document.body.appendChild(script);
			});
			const errors = await page.evaluate(() => window.ERRORS);
			expect(errors.length).toBeGreaterThan(0);
		}));
	}, 40000);

	test('are not detected unexpectedly', async () => {
		await Promise.all(PAGES.UNIQUE.map(async (url) => {
			const page = await browser.newPage();
			await page.authenticate(CREDENTIALS);
			await page.goto(url);
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
		}));
	}, 40000);
});
