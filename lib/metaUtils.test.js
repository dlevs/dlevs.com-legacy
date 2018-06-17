'use strict';

const { expandOpenGraphMeta } = require('./metaUtils');
const { getMediaMeta } = require('./mediaUtils');

describe('expandOpenGraphMeta()', () => {
	test('basic functionality', () => {
		expect(expandOpenGraphMeta({
			title: 'Foo',
			description: 'bar',
			url: 'https://foo.com',
			og: {
				'og:type': 'baz',
			},
		})).toMatchObject({
			'og:title': 'Foo',
			'og:description': 'bar',
			'og:url': 'https://foo.com',
			'og:type': 'baz',
		});
	});
	test('og title and description overwrite defaults', () => {
		expect(expandOpenGraphMeta({
			title: 'Foo',
			description: 'bar',
			og: {
				'og:title': 'Not Foo',
				'og:description': 'Not bar',
			},
		})).toMatchObject({
			'og:title': 'Not Foo',
			'og:description': 'Not bar',
		});
	});
	test('image as a string works', () => {
		const result = expandOpenGraphMeta({
			og: {
				'og:image': 'https://foo.com/foo.png',
			},
		});

		expect(result['og:image']).toBe('https://foo.com/foo.png');
		expect(result['og:image:width']).toBeUndefined();
		expect(result['og:image:height']).toBeUndefined();
	});
	test('image as an object works', () => {
		const result = expandOpenGraphMeta({
			og: {
				'og:image': getMediaMeta('/media/favicon/original.png').versions.large,
			},
		});

		expect(typeof result['og:image']).toBe('string');
		expect(typeof result['og:image:width']).toBe('number');
		expect(typeof result['og:image:height']).toBe('number');
	});
});
