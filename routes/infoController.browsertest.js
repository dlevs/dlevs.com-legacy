'use strict';

const { delay } = require('bluebird');
const { fetch } = require('../tests/testLib/testUtils');
const { ORIGIN } = require('../tests/testLib/testConstants');
const { version, engines } = require('../package');

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

	test('app version is correct', () => {
		expect(info.appVersion).toBe(version);
	});

	test('node version is correct', () => {
		expect(engines.node).toMatch(info.nodeVersion.replace(/^v/, ''));
	});

	test('environment is production', () => {
		expect(info.environment).toBe('production');
	});

	test('server-side caching is on', async () => {
		// TODO: using bluebird here - can it replace "async" module?
		await delay(4000);
		const response2 = await fetch(`${ORIGIN}/info.json`);
		const info2 = await response2.json();
		expect(info.date).toBeDefined();
		expect(info.date).toBe(info2.date);
	}, 20000);

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
