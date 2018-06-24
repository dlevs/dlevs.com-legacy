'use strict';

const { SITE_NAME, ORIGIN } = require('../lib/constants');
const { getMediaMeta } = require('../lib/mediaUtils');
const technologies = require('./technologies');

const description = 'London-based full-stack web developer.';

module.exports = {
	meta: {
		title: SITE_NAME,
		description,
		jsonLd: [
			{
				'@context': 'http://schema.org',
				'@type': 'Person',
				jobTitle: 'Web Developer',
				name: 'Daniel Levett',
				alumniOf: 'University of Hertfordshire',
				gender: 'male',
				nationality: 'British',
				image: getMediaMeta('/media/misc/self.jpg').versions.large.absoluteSrc,
				url: ORIGIN,
				sameAs: [
					'https://www.linkedin.com/in/daniellevett/',
					'https://github.com/dlevs',
					'https://www.npmjs.com/~dlevs',
				],
			},
			{
				'@context': 'http://schema.org',
				'@type': 'WebSite',
				url: ORIGIN,
				name: SITE_NAME,
				author: ORIGIN,
				description,
			},
		],
	},
	projects: [
		{
			heading: 'Content Creation Tool',
			shortDescription: '<p>A web application for editing content on <a href="http://www.demandware.com/">Salesforce Commerce Cloud</a> sites.</p>',
			description: '<p>A web application for editing content on <a href="http://www.demandware.com/">Salesforce Commerce Cloud</a> sites, making use of their REST API to load and save content directly from a site’s business manager portal.</p><p>The editor makes creating complex features like product carousels and social media feeds simple, without the need for a developer to get involved. Behind the scenes, the tool stores content as JSON for populating backend templates.</p>',
			img: {
				src: '/media/projects/json-tool.png',
				alt: 'A screenshot of the content creation tool being used to edit a web article.',
			},
			badges: [
				technologies.es6,
				technologies.react,
				technologies.redux,
				technologies.postCss,
				technologies.webpack,
				technologies.jest,
			],
		},
		{
			heading: 'Email Build Automater',
			shortDescription: '<p>A Node.js framework for building marketing emails.</p>',
			description: '<p>A Node.js framework for building marketing emails. The tool <a href="https://www.npmjs.com/package/xlsx" title="The xlsx package on npm, used to to parse spreadsheets">parses text and links directly from spreadsheet specifications</a> and provides an easy way to stitch them together into HTML files, ready to send.</p><p>Translations are automatically compiled along with the English; build an email in one language and all the others are built for you! Automatic validation ensures quality. This brought my average build time for emails down from about 2 hours to just 15 minutes.</p>',
			img: {
				src: '/media/projects/email-build.png',
				alt: 'A screenshot of the email builder’s web interface.',
			},
			badges: [
				technologies.nodeJs,
				technologies.express,
				technologies.handlebars,
				technologies.jQuery,
				technologies.webSockets,
				technologies.less,
			],
		},
		{
			heading: 'Content Inspector',
			shortDescription: '<p>A content inspector for <a href="https://www.npmjs.com/package/xml-stream" title="The xml-stream package on npm, used to parse XML">XML content exports</a> of <a href="http://www.demandware.com/">Salesforce Commerce Cloud</a> sites.</p>',
			description: '<p>A content inspector for <a href="https://www.npmjs.com/package/xml-stream" title="The xml-stream package on npm, used to parse XML">XML content exports</a> of <a href="http://www.demandware.com/">Salesforce Commerce Cloud</a> sites. It highlights potential errors and enables users to perform batch editing.</p>',
			img: {
				src: '/media/projects/content-inspector.png',
				alt: 'A screenshot of the content inspector showing a listing of content assets.',
			},
			badges: [
				technologies.nodeJs,
				technologies.express,
				technologies.pug,
				technologies.jQuery,
				technologies.less,
			],
		},
	],
	brands: [
		{
			title: 'Jimmy Choo - eCommerce Website',
			name: 'Jimmy Choo',
			url: 'http://www.jimmychoo.com/',
			svg: '/media/brands/jimmy-choo.svg',
		},
		{
			title: 'Bally - eCommerce Website',
			name: 'Bally',
			url: 'http://www.bally.co.uk/',
			svg: '/media/brands/bally.svg',
		},
		{
			title: 'Belstaff - eCommerce Website',
			name: 'Belstaff',
			url: 'https://www.belstaff.co.uk/',
			svg: '/media/brands/belstaff.svg',
		},
	],
};
