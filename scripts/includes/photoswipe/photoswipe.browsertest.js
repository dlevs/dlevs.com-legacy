const puppeteer = require('puppeteer');
const { PAGES, CREDENTIALS } = require('../../../tests/testLib/testConstants');
const { testUrls } = require('../../../tests/testLib/testUtils');

let browser;
beforeAll(async (done) => {
	browser = await puppeteer.launch();
	done();
});
afterAll(async (done) => {
	await browser.close();
	done();
});

const pageSetup = () => {
	window.getState = () => {
		const {
			currentSlide,
			totalSlides,
		} = document.querySelector('.pswp__counter').dataset;

		return {
			isGalleryOpen: !!document.querySelector('.pswp--open'),
			currentSlide: Number(currentSlide),
			totalSlides: Number(totalSlides),
		};
	};
	window.getThumbnails = () => document.querySelectorAll('.js-photoswipe');
	window.wait = delay => new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

const runBrowserTest = async (url, fn) => {
	const page = await browser.newPage();
	await page.authenticate(CREDENTIALS);
	await page.goto(url);
	await page.evaluate(pageSetup);
	return page.evaluate(fn);
};

describe('Photoswipe gallery', () => {
	testUrls(PAGES.WITH_PHOTOSWIPE, {
		'is not open on page load': url => async () => {
			const { isGalleryOpen } = await runBrowserTest(
				url,
				() => window.getState(),
			);
			expect(isGalleryOpen).toBe(false);
		},
		'opens on page load when specified in URL hash': url => async () => {
			const { isGalleryOpen, currentSlide } = await runBrowserTest(
				`${url}#pid=2`,
				() => window.getState(),
			);
			expect(isGalleryOpen).toBe(true);
			expect(currentSlide).toBe(2);
		},
		'opens on click of thumbnails': url => async () => {
			const {
				initial,
				afterClickOnSecondImage,
				afterClickOnFirstImage,
			} = await runBrowserTest(url, () => {
				const states = { initial: window.getState() };

				window.getThumbnails()[1].click();
				states.afterClickOnSecondImage = window.getState();

				window.getThumbnails()[0].click();
				states.afterClickOnFirstImage = window.getState();

				return states;
			});
			expect(initial.isGalleryOpen).toBe(false);
			expect(afterClickOnSecondImage.isGalleryOpen).toBe(true);
			expect(afterClickOnFirstImage.isGalleryOpen).toBe(true);

			expect(afterClickOnSecondImage.currentSlide).toBe(2);
			expect(afterClickOnFirstImage.currentSlide).toBe(1);
		},
		'closes on click of close button': url => async () => {
			const {
				initial,
				afterCloseClick,
			} = await runBrowserTest(`${url}#pid=1`, () => {
				const states = { initial: window.getState() };

				document.querySelector('.pswp__button--close').click();
				states.afterCloseClick = window.getState();

				return states;
			});
			expect(initial.isGalleryOpen).toBe(true);
			expect(afterCloseClick.isGalleryOpen).toBe(false);
		},
		'navigates on click of next and previous buttons': url => async () => {
			const {
				initial,
				afterLeft,
				afterRight,
				afterRightAgain,
			} = await runBrowserTest(`${url}#pid=1`, () => new Promise((resolve) => {
				const left = document.querySelector('.pswp__button--arrow--left');
				const right = document.querySelector('.pswp__button--arrow--right');
				const states = { initial: window.getState() };

				window.wait(100)
					.then(() => {
						left.click();
						states.afterLeft = window.getState();
					})
					.then(() => window.wait(100))
					.then(() => {
						right.click();
						states.afterRight = window.getState();
					})
					.then(() => window.wait(100))
					.then(() => {
						right.click();
						states.afterRightAgain = window.getState();
					})
					.then(() => resolve(states));
			}));
			expect(initial.currentSlide).toBe(1);
			expect(afterLeft.currentSlide).toBe(afterLeft.totalSlides);
			expect(afterRight.currentSlide).toBe(1);
			expect(afterRightAgain.currentSlide).toBe(2);
		},
		'og:image changes as expected when using share URL': url => async () => {
			// Shared URLs have "pid=<n>" in query string to set the og:image meta
			// in markup, allowing correct image to get pulled in on share.
			const getOgImage = () => document
				.querySelector('meta[property="og:image"]')
				.getAttribute('content');

			const defaultOgImage = await runBrowserTest(url, getOgImage);
			const sharedOgImage1 = await runBrowserTest(`${url}?pid=1`, getOgImage);
			const sharedOgImage2 = await runBrowserTest(`${url}?pid=2`, getOgImage);

			expect(typeof defaultOgImage).toBe('string');
			expect(typeof sharedOgImage1).toBe('string');
			expect(typeof sharedOgImage2).toBe('string');

			expect(typeof defaultOgImage).toBe('string');
			expect(typeof sharedOgImage1).toBe('string');
			expect(typeof sharedOgImage2).toBe('string');

			// Check that the og:image URLs are different. The first image in the
			// gallery may double up as the `defaultOgImage`, so no need to check those.
			expect(sharedOgImage2).not.toBe(defaultOgImage);
			expect(sharedOgImage2).not.toBe(sharedOgImage1);
		},
	});
});
