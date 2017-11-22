require('./testLib/testSetup');

const puppeteer = require('puppeteer');
const { SCREENSHOT_CONFIG, CREDENTIALS } = require('./testLib/testConstants');
const { scrollPage } = require('./testLib/testUtils');

let browser;
beforeAll(async (done) => {
	browser = await puppeteer.launch();
	done();
});
afterAll(async (done) => {
	await browser.close();
	done();
});

const createTest = (description, { url, shouldScrollPage, options }, jsEnabled, viewport) => {
	test(description, async () => {
		const page = await browser.newPage();
		await page.authenticate(CREDENTIALS);
		await page.setJavaScriptEnabled(jsEnabled);
		await page.setViewport(viewport);
		await page.goto(url);

		if (shouldScrollPage) {
			// Scroll to bottom to allow image lazyloading to kick in
			await scrollPage(page);
		}

		const screenshot = await page.screenshot(options);

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

	SCREENSHOT_CONFIG.forEach((config) => {
		describe(config.url, () => {
			describe('on desktop', () => {
				createTest('with JS enabled', config, true, desktopViewport);
				createTest('with JS disabled', config, false, desktopViewport);
			});
			describe('on mobile', () => {
				createTest('with JS enabled', config, true, mobileViewport);
				createTest('with JS disabled', config, false, mobileViewport);
			});
		});
	});
});
