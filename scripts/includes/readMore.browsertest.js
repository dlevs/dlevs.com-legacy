const puppeteer = require('puppeteer');
const {PAGES, CREDENTIALS} = require('../../tests/testLib/testConstants');
const URLS = PAGES.WITH_READMORE;

const getStats = async (url, viewportOptions) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.authenticate(CREDENTIALS);
	await page.goto(url);
	await page.setViewport(viewportOptions);
	const stats = await page.evaluate(() => {
		const isVisible = (el) => el.offsetParent !== null;
		const $ = (selector) => Array
			.from(document.querySelectorAll(selector))
			.filter(isVisible);
		const getVisibleElemCounts = () => ({
			buttonCount: $('.js-readmore-button').length,
			shortTextCount: $('.js-readmore-short').length,
			longTextCount: $('.js-readmore-long').length
		});

		const beforeClick = getVisibleElemCounts();

		document.querySelector('.js-readmore-button').click();

		const afterClick = getVisibleElemCounts();

		return {
			beforeClick,
			afterClick
		}
	});
	await browser.close();
	return stats;
};


describe('"Read more..." functionality', () => {
	describe('works as expected on mobile', () => {
		URLS.forEach((url) => {
			test(url, async () => {
				const {beforeClick, afterClick} = await getStats(url, {
					width: 320,
					height: 600
				});

				expect(afterClick.buttonCount).toBe(beforeClick.buttonCount - 1);
				expect(afterClick.shortTextCount).toBe(beforeClick.shortTextCount - 1);
				expect(beforeClick.longTextCount).toBe(0);
				expect(afterClick.longTextCount).toBe(1);
			});
		});
	});
	describe('does nothing on desktop', () => {
		URLS.forEach((url) => {
			test(url, async () => {
				const {beforeClick, afterClick} = await getStats(url, {
					width: 1280,
					height: 800
				});

				// Before click
				expect(beforeClick.buttonCount).toBe(0);
				expect(beforeClick.shortTextCount).toBe(0);

				// After click
				expect(afterClick.buttonCount).toBe(0);
				expect(afterClick.shortTextCount).toBe(0);

				expect(afterClick.longTextCount).toBeGreaterThan(0);
				expect(afterClick.longTextCount).toBe(beforeClick.longTextCount);
			});
		});
	});
});
