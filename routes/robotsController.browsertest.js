const fetch = require('node-fetch');

describe('/robots.txt', () => {
	const url = `https://${process.env.TEST_HOSTNAME}/robots.txt`;

	test('exists', async () => {
		const {ok} = await fetch(url);
		expect(ok).toBe(true);
	});
	test('links to correct sitemap', async () => {
		// Check sitemap exists...
		const sitemapUrl = `https://${process.env.TEST_HOSTNAME}/sitemap.xml`;
		const {ok} = await fetch(sitemapUrl);
		expect(ok).toBe(true);

		// ...and is in robots.txt
		const response = await fetch(url);
		const text = await response.text();
		expect(text).toContain(`Sitemap: ${sitemapUrl}`);
	});
});
