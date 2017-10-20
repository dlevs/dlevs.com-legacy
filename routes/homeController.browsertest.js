const fetch = require('node-fetch');
const {ORIGIN} = require('../tests/testConstants');

describe('Homepage', () => {
	test('server responds with OK status', async () => {
		const {ok} = await fetch(ORIGIN);
		expect(ok).toBe(true);
	});
});
