'use strict';

import { fetch } from '/tests/testLib/browserTestUtils';
import { ORIGIN } from '/tests/testLib/browserTestConstants';

describe('Homepage', () => {
	test('server responds with OK status', async () => {
		const { ok } = await fetch(ORIGIN);
		expect(ok).toBe(true);
	});
});
