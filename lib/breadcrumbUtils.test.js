'use strict';

const { expandBreadcrumb } = require('./breadcrumbUtils');

describe('expandBreadcrumb()', () => {
	test('root expands correctly', () => {
		expect(expandBreadcrumb([
			{ label: 'Home' },
		])).toEqual([
			{ label: 'Home', slug: '', path: '/' },
		]);
	});
	test('creates the correct cumulative paths', () => {
		expect(expandBreadcrumb([
			{ label: 'Home' },
			{ label: 'Blog', slug: 'blog' },
			{ label: 'Cats', slug: 'cats' },
			{ label: 'Fluffy the Cat', slug: 'fluffy-the-cat' },
		])).toEqual([
			{ label: 'Home', slug: '', path: '/' },
			{ label: 'Blog', slug: 'blog', path: '/blog' },
			{ label: 'Cats', slug: 'cats', path: '/blog/cats' },
			{
				label: 'Fluffy the Cat',
				slug: 'fluffy-the-cat',
				path: '/blog/cats/fluffy-the-cat',
			},
		]);
	});
});
