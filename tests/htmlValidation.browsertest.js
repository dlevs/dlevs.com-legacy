const {UNIQUE_PAGE_URLS} = require('./testConstants');
const validator = require('html-validator');

describe('HTML validation', () => {
	let i = UNIQUE_PAGE_URLS.length;
	while (i--) {
		const url = UNIQUE_PAGE_URLS[i];

		test(url, async () => {
			const {messages} = await validator({url, format: 'json'});
			const errors = messages.filter(({type}) => type === 'error');

			expect(errors.length).toBe(0);
		});
	}
});
