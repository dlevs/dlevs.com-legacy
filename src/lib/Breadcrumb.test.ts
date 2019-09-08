import Breadcrumb from './Breadcrumb';

const breadcrumb = new Breadcrumb([
	{ name: 'Home', slug: '' },
	{ name: 'Blog', slug: 'blog' },
	{ name: 'Cats', slug: 'cats' },
	{ name: 'Fluffy the Cat', slug: 'fluffy-the-cat' },
]);
const expectedCurrentPage = {
	name: 'Fluffy the Cat',
	slug: 'fluffy-the-cat',
	path: '/blog/cats/fluffy-the-cat',
};

describe('Breadcrumb', () => {
	test('`breadcrumb.parts` returns the correct cumulative paths', () => {
		expect(breadcrumb.parts).toEqual([
			{ name: 'Home', slug: '', path: '/' },
			{ name: 'Blog', slug: 'blog', path: '/blog' },
			{ name: 'Cats', slug: 'cats', path: '/blog/cats' },
			expectedCurrentPage,
		]);
	});

	test('`breadcrumb.currentPage` returns the last item', () => {
		expect(breadcrumb.currentPage).toEqual(expectedCurrentPage);
	});

	test('`breadcrumb.path` returns the path of the last item', () => {
		expect(breadcrumb.path).toEqual('/blog/cats/fluffy-the-cat');
	});

	test('`breadcrumb.append()` returns a new Breadcrumb instance', () => {
		const newBreadcrumb = breadcrumb.append({ name: 'Foo', slug: 'foo' });

		expect(newBreadcrumb).not.toBe(breadcrumb);
		expect(breadcrumb.path).toEqual('/blog/cats/fluffy-the-cat');
		expect(newBreadcrumb.path).toEqual('/blog/cats/fluffy-the-cat/foo');
	});
});
