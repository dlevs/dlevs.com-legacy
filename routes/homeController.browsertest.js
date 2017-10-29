const {fetch} = require('../tests/testLib/testUtils');
const {ORIGIN} = require('../tests/testLib/testConstants');

describe('Homepage', () => {
	test('server responds with OK status', async () => {
		const {ok} = await fetch(ORIGIN);
		expect(ok).toBe(true);
	});
});
