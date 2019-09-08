'use strict';

import { PAGES } from './testLib/browserTestConstants';
import { fetch } from './testLib/browserTestUtils';

// These tests aren't perfect. The strings could appear in a valid page,
// at which point these tests can be updated. For now, we want to know
// if these strings appear in the HTML as they likely signal an error.
const BLACKLIST = ['undefined', 'null', '[object '];

describe('Blacklisted strings', () => {
	PAGES.UNIQUE.forEach((url) => {
		test(url, async () => {
			const response = await fetch(url);
			const data = await response.text();

			expect(BLACKLIST.every(string => !data.includes(string))).toBe(true);
		});
	});
});
