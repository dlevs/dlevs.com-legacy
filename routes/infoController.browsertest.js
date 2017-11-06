const { fetch } = require('../tests/testLib/testUtils');
const { ORIGIN } = require('../tests/testLib/testConstants');
const { version } = require('../package');

let response;
let info;


beforeAll(async (done) => {
	response = await fetch(`${ORIGIN}/info.json`);
	info = await response.json();
	done();
});


describe('/info.json', () => {
	test('response has correct MIME type', () => {
		const type = response.headers.get('content-type');
		expect(type).toContain('application/json');
	});

	test('version is correct', () => {
		expect(info.version).toBe(version);
	});

	test('environment is production', () => {
		expect(info.environment).toBe('production');
	});

	describe('lastCommit', () => {
		test('branch is correct', () => {
			expect(info.lastCommit.ref).toMatch(/^HEAD -> master/);
		});

		test('is up to date with last commit on github', async () => {
			const githubResponse = await fetch('https://api.github.com/repos/dlevs/dlevs.com/git/refs/heads/master');
			const { object } = await githubResponse.json();

			expect(info.lastCommit.sha).toBe(object.sha);
		});
	});
});
