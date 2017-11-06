const { fetch } = require('../tests/testLib/testUtils');
const { ORIGIN } = require('../tests/testLib/testConstants');


describe('/robots.txt', () => {
	const url = `${ORIGIN}/robots.txt`;

	test('exists', async () => {
		const response = await fetch(url);
		expect(response).toMatchObject({ ok: true });
	});

	test('response has correct MIME type', async () => {
		const response = await fetch(`${ORIGIN}/robots.txt`);
		const type = response.headers.get('content-type');

		expect(type).toContain('text/plain');
	});

	test('links to correct sitemap', async () => {
		// Check sitemap exists...
		const sitemapUrl = `${ORIGIN}/sitemap.xml`;
		const sitemapResponse = await fetch(sitemapUrl);
		expect(sitemapResponse).toMatchObject({ ok: true });

		// ...and is in robots.txt
		const response = await fetch(url);
		const text = await response.text();
		expect(text).toContain(`Sitemap: ${sitemapUrl}`);
	});
});
