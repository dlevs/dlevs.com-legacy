'use strict';

import { getCanonicalUrl, getShareUrl } from './urlUtils';

const urlFormatterTests = (fn) => {
	test('strips trailing slash', () => {
		expect(fn('https://foo.com/')).toBe('https://foo.com');
	});
	test('strips www', () => {
		expect(fn('https://www.foo.com')).toBe('https://foo.com');
	});
	test('doesn\'t change http to https', () => {
		expect(fn('http://foo.com')).toBe('http://foo.com');
	});
	test('sorts url parameters', () => {
		expect(fn('https://foo.com/?b=1&c=1&a=1')).toBe('https://foo.com/?a=1&b=1&c=1');
	});
	test('adds slash before query string', () => {
		expect(fn('https://foo.com?a=1')).toBe('https://foo.com/?a=1');
	});
	test('strips hash', () => {
		expect(fn('https://foo.com?a=1#foo')).toBe('https://foo.com/?a=1');
		expect(fn('https://foo.com#foo=bar&yes=no')).toBe('https://foo.com');
		expect(fn('https://foo.com/#foo=bar&yes=no')).toBe('https://foo.com');
	});
};

describe('getCanonicalUrl()', () => {
	urlFormatterTests(getCanonicalUrl);
	test('strips certain url parameters', () => {
		// Single params
		expect(getCanonicalUrl('https://foo.com/?pretty=true')).toBe('https://foo.com');
		expect(getCanonicalUrl('https://foo.com/?pid=1')).toBe('https://foo.com');
		expect(getCanonicalUrl('https://foo.com/?gid=1')).toBe('https://foo.com');

		// Used in combination
		expect(getCanonicalUrl('https://foo.com/?pretty&pid=1&gid=1')).toBe('https://foo.com');
		expect(getCanonicalUrl('https://foo.com/?pretty&pid=1&a=1&b=1&gid=1')).toBe('https://foo.com/?a=1&b=1');
	});
});

describe('getShareUrl()', () => {
	urlFormatterTests(getShareUrl);
	test('strips certain url parameters while keeping important share parameters', () => {
		// Single params
		expect(getShareUrl('https://foo.com/?pretty')).toBe('https://foo.com');
		expect(getShareUrl('https://foo.com/?pid=1')).toBe('https://foo.com/?pid=1');
		expect(getShareUrl('https://foo.com/?gid=1')).toBe('https://foo.com/?gid=1');

		// Used in combination
		expect(getShareUrl('https://foo.com/?pid=1&gid=1&pretty&foo=1')).toBe('https://foo.com/?foo=1&gid=1&pid=1');
	});
});
