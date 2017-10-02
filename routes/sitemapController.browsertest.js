const puppeteer = require('puppeteer');

describe('/sitemap.xml', () => {
	test('All links are https', async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(`https://${process.env.TEST_HOSTNAME}/sitemap.xml`);
		const links = await page.evaluate(() => Array
			.from(document.querySelectorAll('loc'))
			.map(({textContent}) => textContent)
		);
		expect(links.length).toBeGreaterThan(0);
		expect(links.every((link) => link.startsWith('https://'))).toBe(true);
		await browser.close();
	});
});
