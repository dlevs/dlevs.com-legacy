'use strict';

const { getLastCommit } = require('./gitUtils');

let lastCommit;


beforeAll(async (done) => {
	lastCommit = await getLastCommit();
	done();
});


describe('getLastCommit()', () => {
	test('returns an object with values of expected type', async () => {
		expect(typeof lastCommit.ref).toBe('string');
		expect(typeof lastCommit.sha).toBe('string');
		expect(typeof lastCommit.message).toBe('string');
		expect(typeof lastCommit.date).toBe('string');
	});
	test('commit hash is correct format', async () => {
		expect(typeof lastCommit.sha).toBe('string');
		expect(lastCommit.sha.length).toBe(40);
	});
	test('date is valid', async () => {
		expect(Number.isNaN(Date.parse(lastCommit.date))).toBe(false);
	});
});
