require('./testLib/testSetup');

const puppeteer = require('puppeteer');
const Promise = require('bluebird');
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

const createTest = (description, url, jsEnabled, viewport) => {
	test(description, async () => {
		const page = await browser.newPage();
		await page.authenticate(CREDENTIALS);
		await page.setJavaScriptEnabled(jsEnabled);
		await page.setViewport(viewport);
		await page.goto(url);
		await page.evaluate(() => {
			// Scroll to bottom to allow image lazyloading to kick in
			window.scroll({
				top: document.body.offsetHeight - window.innerHeight,
				left: 0,
				behavior: 'smooth',
			});
		});
		// Allow time for images to load
		await Promise.delay(5000);
		const screenshot = await page.screenshot({
			fullPage: true,
		});

		expect(screenshot).toMatchImageSnapshot();
	}, 40000);
};

// When tests run for the first time, they generate PNG screenshot image files
// as a reference for how the site should look. Test after this will compare
// the way the site currently looks to these screenshots, and highlight any
// changes as potential regression.
//
// Run tests with the --updateSnapshot flag to update the images instead of
// comparing.
describe('Screenshots match for', () => {
	const desktopViewport = { width: 1280, height: 800 };
	const mobileViewport = { width: 320, height: 568 };

	PAGES.UNIQUE.forEach((url) => {
		describe(url, () => {
			describe('on desktop', () => {
				createTest('with JS enabled', url, true, desktopViewport);
				createTest('with JS disabled', url, false, desktopViewport);
			});
			describe('on mobile', () => {
				createTest('with JS enabled', url, true, mobileViewport);
				createTest('with JS disabled', url, false, mobileViewport);
			});
		});
	});
});
