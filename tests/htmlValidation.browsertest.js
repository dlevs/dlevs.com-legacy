const {PAGES} = require('./testLib/testConstants');
const {fetch} = require('./testLib/testUtils');
const validator = require('html-validator');

describe('HTML validation', () => {
	let i = PAGES.UNIQUE.length;
	while (i--) {
		const url = PAGES.UNIQUE[i];

		test(url, async () => {
			const response = await fetch(url);
			const data = await response.text();
			const {messages} = await validator({data, format: 'json'});
			const errors = messages.filter(({type}) => type.includes('error'));

			expect(errors.length).toBe(0);
		});
	}
});
