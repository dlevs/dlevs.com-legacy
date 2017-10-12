const {PRODUCTION_ORIGIN} = require('../lib/constants');
const title = 'Daniel Levett';
const description = 'London-based fullstack web developer.';

module.exports = {
	title,
	description,
	"technologies": {
		"React": {
			"url": "https://facebook.github.io/react/"
		},
		"Redux": {
			"url": "http://redux.js.org/"
		},
		"PostCSS": {
			"url": "http://postcss.org/"
		},
		"ES6": {
			"url": "https://babeljs.io/"
		},
		"webpack": {
			"url": "https://webpack.js.org/"
		},
		"Express": {
			"url": "https://expressjs.com/"
		},
		"Less": {
			"url": "http://lesscss.org/"
		},
		"Jest": {
			"url": "https://facebook.github.io/jest/"
		},
		"jQuery": {
			"url": "https://jquery.com/"
		},
		"Node.js": {
			"url": "https://nodejs.org/en/"
		},
		"Web Sockets": {
			"url": "https://socket.io/"
		},
		"Handlebars": {
			"url": "http://handlebarsjs.com/"
		},
		"Pug": {
			"url": "https://www.npmjs.com/package/pug"
		}
	},
	"projects": [
		{
			"heading": "JSON Content Editor",
			"shortDescription": "<p>A web application for editing content on <a href=\"http://www.demandware.com/\">Demandware sites</a>.</p>",
			"description": "<p>A web application for editing content on <a href=\"http://www.demandware.com/\">Demandware sites</a>, making use of Demandware's REST API to load and save content directly from a site's business manager portal.</p><p>The editor makes creating complex features like product carousels and social media feeds simple, without the need for a developer to get involved. Behind the scenes, the tool stores content as JSON for populating backend templates.</p>",
			"img": {
				"src": "/images/projects/json-tool.png",
				"alt": "A screenshot of the JSON content editor being used to edit a web article."
			},
			"badges": [
				"ES6",
				"React",
				"Redux",
				"PostCSS",
				"webpack",
				"Jest"
			]
		},
		{
			"heading": "Email Build Automater",
			"shortDescription": "<p>A Node.js framework for building marketing emails.</p>",
			"description": "<p>A Node.js framework for building marketing emails. The tool <a href=\"https://www.npmjs.com/package/xlsx\" title=\"The xlsx package on npm, used to to parse spreadsheets\">parses text and links directly from spreadsheet specifications</a> and provides an easy way to stitch them together into HTML files, ready to send.</p><p>Translations are automatically compiled along with the English; build an email in one language and all the others are built for you! Automatic validation ensures quality. This brought my average build time for emails down from about 2 hours to just 15 minutes.</p>",
			"img": {
				"src": "/images/projects/email-build.png",
				"alt": "A screenshot of the email builder's web interface."
			},
			"badges": [
				"Node.js",
				"Express",
				"Handlebars",
				"jQuery",
				"Web Sockets",
				"Less"
			]
		},
		{
			"heading": "Demandware Content Inspector",
			"shortDescription": "<p>A content inspector for <a href=\"https://www.npmjs.com/package/xml-stream\" title=\"The xml-stream package on npm, used to parse XML\">XML content exports</a> of <a href=\"http://www.demandware.com/\">Demandware sites</a>.</p>",
			"description": "<p>A content inspector for <a href=\"https://www.npmjs.com/package/xml-stream\" title=\"The xml-stream package on npm, used to parse XML\">XML content exports</a> of <a href=\"http://www.demandware.com/\">Demandware sites</a>. It highlights potential errors and enables users to perform batch editing.</p><p>The tool drove our lead developer mad, as it allowed him to see all the broken HTML and duplicate content that he had no time to fix!</p>",
			"img": {
				"src": "/images/projects/content-inspector.png",
				"alt": "A screenshot of the content inspector showing a listing of content assets."
			},
			"badges": [
				"Node.js",
				"Express",
				"Pug",
				"jQuery",
				"Less"
			]
		}
	],
	"skills": [
		{
			"heading": "JavaScript",
			"skills": [
				"ES6",
				"ReactJS",
				"jQuery (reluctantly)"
			]
		},
		{
			"heading": "Web",
			"skills": [
				"Accessibility",
				"Tagging"
			]
		}
	],
	"brands": [
		{
			"title": "Jimmy Choo - eCommerce Website",
			"name": "Jimmy Choo",
			"url": "http://www.jimmychoo.com/",
			"svg": "/images/brands/jimmy-choo.svg"
		},
		{
			"title": "Bally - eCommerce Website",
			"name": "Bally",
			"url": "http://www.bally.co.uk/",
			"svg": "/images/brands/bally.svg"
		},
		{
			"title": "Belstaff - eCommerce Website",
			"name": "Belstaff",
			"url": "https://www.belstaff.co.uk/",
			"svg": "/images/brands/belstaff.svg"
		}
	],
	"jsonLd": [
		{
			"@context": "http://schema.org",
			"@type": "Person",
			"jobTitle": "Web Developer",
			"name": "Daniel Levett",
			"alumniOf": "University of Hertfordshire",
			"gender": "male",
			"nationality": "British",
			"url": PRODUCTION_ORIGIN,
			"sameAs": [
				"https://www.linkedin.com/in/daniellevett/",
				"https://github.com/dlevs",
				"https://www.npmjs.com/~dlevs"
			]
		},
		{
			"@context": "http://schema.org",
			"@type": "WebSite",
			"url": PRODUCTION_ORIGIN,
			"name": title,
			"author": PRODUCTION_ORIGIN,
			"description": description
		}
	]
};