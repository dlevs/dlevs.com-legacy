const {promisify} = require('util');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const uniqBy = require('lodash/uniqBy');
const eachSeries = promisify(require('async').eachSeries);

const imageUrlRegex = /\.(jpg|webp)$/;

let links;

const getPageLinks = () => links.filter(({type}) => type === 'page');
const getImageLinks = () => links.filter(({type}) => type === 'image');

beforeAll(async (done) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(`https://${process.env.TEST_HOSTNAME}/sitemap.xml`);
	links = await page.evaluate(() => Array
		.from(document.querySelectorAll('loc'))
		.map(({prefix, textContent}) => ({
			url: textContent,
			type: prefix || 'page'
		}))
	);
	await browser.close();
	done();
});

describe('/sitemap.xml', () => {
	test('has page links', async () => {
		expect(getPageLinks().length).toBeGreaterThan(0);
	});
	test('has image links', async () => {
		expect(getImageLinks().length).toBeGreaterThan(0);
	});
	test('image links have image extensions', async () => {
		expect(
			getImageLinks().every(
				({url}) => imageUrlRegex.test(url)
			)
		).toBe(true);
	});
	test('all links are https', async () => {
		expect(
			links.every(
				({url}) => url.startsWith('https://')
			)
		).toBe(true);
	});
	test('has no duplicate non-image links', async () => {
		// Duplicates may not be invalid in sitemaps, but it suggests
		// possible URL collisions in the content.
		expect(
			uniqBy(getPageLinks(), 'url').length
		).toBe(
			getPageLinks().length
		);
	});
	test('all page links work', () => {
		return eachSeries(getPageLinks(), async ({url}) => {
			const {ok} = await fetch(url);
			expect(ok).toBe(true)
		});
	}, 20000);
	test('first 5 images work', () => {
		return eachSeries(getImageLinks().slice(0, 5), async ({url}) => {
			const {ok} = await fetch(url);
			expect(ok).toBe(true)
		});
	}, 20000);
});
