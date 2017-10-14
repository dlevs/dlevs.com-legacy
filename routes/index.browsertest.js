const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const validator = require('html-validator');

describe('Basic functionality', () => {
	test('server responds with OK status', async () => {
		const {ok} = await fetch(`https://${process.env.TEST_HOSTNAME}`);
		expect(ok).toBe(true);
	});
});

describe('Redirects', () => {
	// Home
	const expectedHomeUrl = `https://${process.env.TEST_HOSTNAME}/`;

	test('redirects http to https', async () => {
		const {url} = await fetch(`http://${process.env.TEST_HOSTNAME}`);
		expect(url).toBe(expectedHomeUrl);
	});
	test('strips www subdomain', async () => {
		const {url} = await fetch(`https://www.${process.env.TEST_HOSTNAME}`);
		expect(url).toBe(expectedHomeUrl);
	});
	test('strips www subdomain and redirects from http to https', async () => {
		const {url} = await fetch(`http://www.${process.env.TEST_HOSTNAME}`);
		expect(url).toBe(expectedHomeUrl);
	});

	// Other pages
	test('retains entire URL path on redirect', async () => {
		{
			const {url} = await fetch(`http://www.${process.env.TEST_HOSTNAME}/foo`);
			expect(url).toBe(`https://${process.env.TEST_HOSTNAME}/foo`);
		}
		{
			const {url} = await fetch(`http://www.${process.env.TEST_HOSTNAME}/foo/bar`);
			expect(url).toBe(`https://${process.env.TEST_HOSTNAME}/foo/bar`);
		}
	});
	test('retains query string redirect', async () => {
		{
			const {url} = await fetch(`http://www.${process.env.TEST_HOSTNAME}/?foo=bar`);
			expect(url).toBe(`https://${process.env.TEST_HOSTNAME}/?foo=bar`);
		}
		{
			const {url} = await fetch(`http://www.${process.env.TEST_HOSTNAME}/something?foo=bar`);
			expect(url).toBe(`https://${process.env.TEST_HOSTNAME}/something?foo=bar`);
		}
	});

	// Slashes
	test('Strips trailing slashes', async () => {
		{
			const {url} = await fetch(`http://www.${process.env.TEST_HOSTNAME}/travel/`);
			expect(url).toBe(`https://${process.env.TEST_HOSTNAME}/travel`);
		}
		{
			const {url} = await fetch(`http://www.${process.env.TEST_HOSTNAME}/something/non-existent/`);
			expect(url).toBe(`https://${process.env.TEST_HOSTNAME}/something/non-existent`);
		}
	});
});

describe('404 page', () => {
	const paths = [
		'/non-existent-page',

		// Test a page that is handled by koa-router.
		// Custom error page should show here too.
		'/travel/non-existent-page'
	];
	let i = paths.length;

	while (i--) {
		const url = `https://www.${process.env.TEST_HOSTNAME}${paths[i]}`;

		describe(url, () => {
			test('has correct status code', async () => {
				const {ok, status} = await fetch(url);
				expect(ok).toBe(false);
				expect(status).toBe(404)
			});
			test('has correct text', async () => {
				const browser = await puppeteer.launch();
				const page = await browser.newPage();
				await page.goto(url);
				const {
					title,
					body,
					isDebugTextShowing
				} = await page.evaluate(() => {
					return {
						title: document.title,
						body: document.body.innerHTML,
						isDebugTextShowing: document.getElementsByTagName('pre').length > 0
					}
				});
				await browser.close();

				expect(isDebugTextShowing).toBe(false);
				expect(title.toLowerCase()).toContain('not found');
				expect(body.toLowerCase()).toContain('not found');
			});
		});
	}
});

describe('HTML validation', () => {
	const paths = [
		'/',
		'/travel',
		'/travel/ireland',
		'/travel/ireland/dublin'
	];
	let i = paths.length;

	while (i--) {
		const url = `https://www.${process.env.TEST_HOSTNAME}${paths[i]}`;

		test(url, async () => {
			const {messages} = await validator({url, format: 'json'});
			const errors = messages.filter(({type}) => type === 'error');

			expect(errors.length).toBe(0);
		});
	}
});
