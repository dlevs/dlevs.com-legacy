'use strict';

const { expandOpenGraphMeta } = require('./metaUtils');
const { getImageMeta } = require('./imageUtils');

describe('expandOpenGraphMeta()', () => {
	test('basic functionality', () => {
		expect(expandOpenGraphMeta({
			title: 'Foo',
			description: 'bar',
			url: 'https://foo.com',
			og: {
				type: 'baz',
			},
		})).toMatchObject({
			title: 'Foo',
			description: 'bar',
			url: 'https://foo.com',
			type: 'baz',
		});
	});
	test('og title and description overwrite defaults', () => {
		expect(expandOpenGraphMeta({
			title: 'Foo',
			description: 'bar',
			og: {
				title: 'Not Foo',
				description: 'Not bar',
			},
		})).toMatchObject({
			title: 'Not Foo',
			description: 'Not bar',
		});
	});
	test('image as a string works', () => {
		const result = expandOpenGraphMeta({
			og: {
				image: 'https://foo.com/foo.png',
			},
		});

		expect(result.image).toBe('https://foo.com/foo.png');
		expect(result['image:width']).toBeUndefined();
		expect(result['image:height']).toBeUndefined();
	});
	test('image as an object works', () => {
		const result = expandOpenGraphMeta({
			og: {
				image: getImageMeta('/media/favicon/original.png').large,
			},
		});

		expect(typeof result.image).toBe('string');
		expect(typeof result['image:width']).toBe('number');
		expect(typeof result['image:height']).toBe('number');
	});
});
