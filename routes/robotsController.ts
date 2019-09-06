import { Context } from 'koa';

/**
 * Generate robots text with absolute URLs.
 */
const getRobotsText = (origin: string) => `

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
	index: (ctx: Context) => {
		ctx.body = getRobotsText(ctx.origin);
	},
});
