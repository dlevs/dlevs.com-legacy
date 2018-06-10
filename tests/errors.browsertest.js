'use strict';

const puppeteer = require('puppeteer');
const { PAGES, CREDENTIALS, ORIGIN } = require('./testLib/testConstants');
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


const createTest = ({
	url,
	eventName,
	eventsFilter,
	shouldFail,
}) => async () => {
	const page = await browser.newPage();
	const events = [];

	page.on(eventName, (event) => {
		if (!eventsFilter || eventsFilter(event)) {
			events.push(event);
		}
	});

	await page.authenticate(CREDENTIALS);
	await page.goto(url);

	// Scroll to bottom to allow image lazyloading to kick in, in case
	// that triggers any errors.
	await scrollPage(page);

	// If features exist on page, trigger them to check they do not
	// cause errors.
	await page.evaluate(() => {
		const photoswipe = document.querySelector('.js-photoswipe');
		const readmore = document.querySelector('.readmore__checkbox');

		if (photoswipe) photoswipe.click();
		if (readmore) readmore.click();
	});

	if (shouldFail) {
		expect(events.length).toBeGreaterThan(0);
	} else {
		expect(events.length).toBe(0);
	}
};

describe('JavaScript errors', () => {
	const eventName = 'pageerror';

	test('are detected when they occur', createTest({
		url: `${ORIGIN}/test/js-error.html`,
		eventName,
		shouldFail: true,
	}), 20000);

	describe('are not detected unexpectedly', () => {
		PAGES.UNIQUE.forEach((url) => {
			test(url, createTest({
				url,
				eventName,
				shouldFail: false,
			}), 20000);
		});
	});
});

describe('Asset network errors', () => {
	const eventName = 'requestfinished';
	const eventsFilter = request => !request.response().ok();

	test('are detected when they occur', createTest({
		url: `${ORIGIN}/test/asset-error.html`,
		eventName,
		eventsFilter,
		shouldFail: true,
	}), 20000);

	describe('are not detected unexpectedly', () => {
		PAGES.UNIQUE.forEach((url) => {
			test(url, createTest({
				url,
				eventName,
				eventsFilter,
				shouldFail: false,
			}), 20000);
		});
	});
});
