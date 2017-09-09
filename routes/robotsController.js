/**
 * Geneate robots text with absolute URLs.
 *
 * @param {String} origin
 */
const getRobotsText = (origin) => `

# Allow crawling of all content
User-agent: *
Disallow:

# XML Sitemaps
Sitemap: ${origin}/sitemap.xml

`.trim();

/*
 * Robots text needs to have an absolute path for the sitemap, therefore,
 * it has its own route to generate this dynamically.
 */
module.exports = () => ({
	index: (ctx) => {
		ctx.body = getRobotsText(ctx.origin);
		ctx.type = 'text/plain';
	}
});
