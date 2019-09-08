import { toFixedTrimmed } from './numberUtils';

describe('toFixedTrimmed()', () => {
	test('precision works', () => {
		expect(toFixedTrimmed(0.11111, 2)).toBe('0.11');
		expect(toFixedTrimmed(0.11111, 4)).toBe('0.1111');
	});
	test('rounds numbers down', () => {
		expect(toFixedTrimmed(10.333333, 2)).toBe('10.33');
	});
	test('rounds numbers up', () => {
		expect(toFixedTrimmed(10.666666, 2)).toBe('10.67');
		expect(toFixedTrimmed(10.555555, 2)).toBe('10.56');
	});
	test('trims necessary zeros and dots from end of string', () => {
		expect(toFixedTrimmed(10.7, 2)).toBe('10.7');
		expect(toFixedTrimmed(0.18, 4)).toBe('0.18');
		expect(toFixedTrimmed(0, 4)).toBe('0');
		expect(toFixedTrimmed(0, 0)).toBe('0');
		expect(toFixedTrimmed(0.00001, 4)).toBe('0');
		expect(toFixedTrimmed(40.2, 4)).toBe('40.2');
		expect(toFixedTrimmed(40, 4)).toBe('40');
		expect(toFixedTrimmed(40, 0)).toBe('40');
		expect(toFixedTrimmed(10000.004, 1)).toBe('10000');
	});
});
