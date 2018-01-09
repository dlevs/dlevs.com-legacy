'use strict';

const isEqual = require('lodash/isEqual');
const { immutableExtend } = require('./objectUtils');

describe('immutableExtend()', () => {
	const getObjects = () => ({
		a: { a: 1 },
		b: { b: 2 },
		c: { c: 3 },
	});

	test('merges objects', () => {
		const { a, b, c } = getObjects();

		expect(isEqual(immutableExtend(a, b), { a: 1, b: 2 })).toBe(true);
		expect(isEqual(immutableExtend(a), { a: 1 })).toBe(true);
		expect(isEqual(immutableExtend(a, b, c), { a: 1, b: 2, c: 3 })).toBe(true);
	});

	test('does not mutate arguments', () => {
		const { a, b, c } = getObjects();

		immutableExtend(a, b);
		immutableExtend(b, c, a);
		immutableExtend(c, a, b);

		expect(isEqual(a, getObjects().a)).toBe(true);
		expect(isEqual(b, getObjects().b)).toBe(true);
		expect(isEqual(c, getObjects().c)).toBe(true);
	});
});
