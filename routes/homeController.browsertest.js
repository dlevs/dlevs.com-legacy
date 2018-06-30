'use strict';

const { fetch } = require('../tests/testLib/browserTestUtils');
const { ORIGIN } = require('../tests/testLib/browserTestConstants');

describe('Homepage', () => {
	test('server responds with OK status', async () => {
		const { ok } = await fetch(ORIGIN);
		expect(ok).toBe(true);
	});
});
