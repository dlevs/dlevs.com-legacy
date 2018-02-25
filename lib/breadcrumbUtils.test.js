'use strict';

const { expandBreadcrumb } = require('./breadcrumbUtils');

describe('expandBreadcrumb()', () => {
	test('root expands correctly', () => {
		expect(expandBreadcrumb([
			{ name: 'Home' },
		])).toEqual([
			{ name: 'Home', slug: '', path: '/' },
		]);
	});
	test('creates the correct cumulative paths', () => {
		expect(expandBreadcrumb([
			{ name: 'Home' },
			{ name: 'Blog', slug: 'blog' },
			{ name: 'Cats', slug: 'cats' },
			{ name: 'Fluffy the Cat', slug: 'fluffy-the-cat' },
		])).toEqual([
			{ name: 'Home', slug: '', path: '/' },
			{ name: 'Blog', slug: 'blog', path: '/blog' },
			{ name: 'Cats', slug: 'cats', path: '/blog/cats' },
			{
				name: 'Fluffy the Cat',
				slug: 'fluffy-the-cat',
				path: '/blog/cats/fluffy-the-cat',
			},
		]);
	});
});
