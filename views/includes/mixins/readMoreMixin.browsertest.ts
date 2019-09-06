'use strict';

const puppeteer = require('puppeteer');
const { PAGES, CREDENTIALS } = require('/tests/testLib/browserTestConstants');
const { testUrls } = require('/tests/testLib/browserTestUtils');

let browser;
beforeAll(async (done) => {
	browser = await puppeteer.launch();
	done();
});
afterAll(async (done) => {
	await browser.close();
	done();
});


const getStats = async (url, viewportOptions) => {
	const page = await browser.newPage();
	await page.authenticate(CREDENTIALS);
	await page.goto(url);
	await page.setViewport(viewportOptions);
	await page.setJavaScriptEnabled(false);
	const stats = await page.evaluate(() => {
		const isVisible = el => el.offsetParent !== null;
		const $ = selector => Array
			.from(document.querySelectorAll(selector))
			.filter(isVisible);
		const getVisibleElemCounts = () => ({
			buttonCount: $('.readmore__checkbox').length,
			shortTextCount: $('.readmore__short').length,
			longTextCount: $('.readmore__long').length,
		});

		const beforeClick = getVisibleElemCounts();

		document.querySelector('.readmore__checkbox').click();

		const afterClick = getVisibleElemCounts();

		return {
			beforeClick,
			afterClick,
		};
	});
	return stats;
};

describe('"Read more…" functionality', () => {
	testUrls(PAGES.WITH_READMORE, {
		'works as expected on mobile': async (url) => {
			const { beforeClick, afterClick } = await getStats(url, {
				width: 320,
				height: 600,
			});

			expect(afterClick.buttonCount).toBe(beforeClick.buttonCount - 1);
			expect(afterClick.shortTextCount).toBe(beforeClick.shortTextCount - 1);
			expect(beforeClick.longTextCount).toBe(0);
			expect(afterClick.longTextCount).toBe(1);
		},
		'does nothing on desktop': async (url) => {
			const { beforeClick, afterClick } = await getStats(url, {
				width: 1280,
				height: 800,
			});

			// Before click
			expect(beforeClick.buttonCount).toBe(0);
			expect(beforeClick.shortTextCount).toBe(0);

			// After click
			expect(afterClick.buttonCount).toBe(0);
			expect(afterClick.shortTextCount).toBe(0);

			expect(afterClick.longTextCount).toBeGreaterThan(0);
			expect(afterClick.longTextCount).toBe(beforeClick.longTextCount);
		},
	});
});
