'use strict';

const { root, relativeToRoot } = require('./pathUtils');

describe('root()', () => {
	test('paths are relative to the root', () => {
		// eslint-disable-next-line import/no-dynamic-require, global-require
		expect(require(root('./lib/pathUtils')).root).toBe(root);
	});
	test('takes multiple arguments', () => {
		const valueToTest = root('../', '../');
		const expected = root('../../');

		expect(valueToTest).toBe(expected);
		expect(typeof valueToTest).toBe('string');
	});
});

describe('relativeToRoot()', () => {
	test('returns a path relative to the root', () => {
		expect(relativeToRoot(root('./images'))).toBe('images');
		expect(relativeToRoot(root('../images'))).toBe('../images');
	});
});
