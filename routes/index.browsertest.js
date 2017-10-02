const fetch = require('node-fetch');

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
});

describe('404 page', () => {
	const nonExistentUrl = `https://www.${process.env.TEST_HOSTNAME}/non-existent-page`;

	test('has correct status code',async () => {
		const {ok, status} = await fetch(nonExistentUrl);
		expect(ok).toBe(false);
		expect(status).toBe(404)
	});
	test('has correct text', async () => {
		const response = await fetch(nonExistentUrl);
		const text = await response.text();
		expect(text.toLowerCase()).toContain('not found');
	});
});
