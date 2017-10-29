const {UNIQUE_PAGE_URLS} = require('./testLib/testConstants');
const {fetch} = require('./testLib/testUtils');
const validator = require('html-validator');

describe('HTML validation', () => {
	let i = UNIQUE_PAGE_URLS.length;
	while (i--) {
		const url = UNIQUE_PAGE_URLS[i];

		test(url, async () => {
			const response = await fetch(url);
			const data = await response.text();
			const {messages} = await validator({data, format: 'json'});
			const errors = messages.filter(({type}) => type.includes('error'));

			expect(errors.length).toBe(0);
		});
	}
});
