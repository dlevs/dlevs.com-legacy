import { root, relativeToRoot } from './pathUtils';

describe('root()', () => {
	test('returns an absolute path', () => {
		expect(root('./lib/pathUtils')).toMatch(/^\//);
	});
	test('resolves paths relative to the project root', () => {
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
	test('returns a path relative to the project root', () => {
		expect(relativeToRoot(root('./media'))).toBe('media');
		expect(relativeToRoot(root('../media'))).toBe('../media');
	});
});
