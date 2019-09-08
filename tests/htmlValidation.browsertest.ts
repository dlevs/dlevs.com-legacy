'use strict';

import { PAGES } from './testLib/browserTestConstants';
import { fetch } from './testLib/browserTestUtils';
import validator from 'html-validator';

describe('HTML validation', () => {
	PAGES.UNIQUE.forEach((url) => {
		test(url, async () => {
			const response = await fetch(url);
			const data = await response.text();
			const { messages } = await validator({ data, format: 'json' });
			const errors = messages.filter(({ type }) => type.includes('error'));

			expect(errors.length).toBe(0);
		});
	});
});
