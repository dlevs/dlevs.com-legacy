'use strict';

const { fetch } = require('./testLib/browserTestUtils');
const { HOSTNAME, ORIGIN } = require('./testLib/browserTestConstants');


describe('Redirects', () => {
	const expectedHomeUrl = `https://${HOSTNAME}/`;

	// Home
	test('redirects http to https', async () => {
		const { url } = await fetch(`http://${HOSTNAME}`);
		expect(url).toBe(expectedHomeUrl);
	});
	test('strips www subdomain', async () => {
		const { url } = await fetch(`https://www.${HOSTNAME}`);
		expect(url).toBe(expectedHomeUrl);
	});
	test('strips www subdomain and redirects from http to https', async () => {
		const { url } = await fetch(`http://www.${HOSTNAME}`);
		expect(url).toBe(expectedHomeUrl);
	});

	// Other pages
	test('retains entire URL path on redirect', async () => {
		{
			const { url } = await fetch(`http://www.${HOSTNAME}/foo`);
			expect(url).toBe(`${ORIGIN}/foo`);
		}
		{
			const { url } = await fetch(`http://www.${HOSTNAME}/foo/bar`);
			expect(url).toBe(`${ORIGIN}/foo/bar`);
		}
	});
	test('retains query string redirect', async () => {
		{
			const { url } = await fetch(`http://www.${HOSTNAME}/?foo=bar`);
			expect(url).toBe(`${ORIGIN}/?foo=bar`);
		}
		{
			const { url } = await fetch(`http://www.${HOSTNAME}/something?foo=bar`);
			expect(url).toBe(`${ORIGIN}/something?foo=bar`);
		}
	});

	// Slashes
	test('Strips trailing slashes on normal navigation', async () => {
		{
			const { url } = await fetch(`${ORIGIN}/travel/`);
			expect(url).toBe(`${ORIGIN}/travel`);
		}
		{
			const { url } = await fetch(`${ORIGIN}/something/non-existent/`);
			expect(url).toBe(`${ORIGIN}/something/non-existent`);
		}
	});
	test('Strips trailing slashes on redirect', async () => {
		{
			const { url } = await fetch(`http://www.${HOSTNAME}/travel/`);
			expect(url).toBe(`${ORIGIN}/travel`);
		}
		{
			const { url } = await fetch(`http://www.${HOSTNAME}/something/non-existent/`);
			expect(url).toBe(`${ORIGIN}/something/non-existent`);
		}
	});
});
