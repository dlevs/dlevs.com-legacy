'use strict';

const config = require('./config.js');
const sampleConfig = require('./config.sample.js');

const configTest = ({
	setProcessEnv,
	PORT,
	GOOGLE_ANALYTICS_ID,
	IS_BEHIND_PROXY,
	HOSTNAME,
	ORIGIN,
}) => {
	test('setProcessEnv()', () => {
		expect(typeof setProcessEnv).toBe('function');
		process.env.NODE_ENV = 'test';
		setProcessEnv();
		expect(process.env.NODE_ENV).toMatch(/^(development|production)$/);
	});

	test('expected constants', () => {
		expect(typeof PORT).toBe('number');
		expect(typeof GOOGLE_ANALYTICS_ID === 'string' || GOOGLE_ANALYTICS_ID === null).toBe(true);
		expect(typeof IS_BEHIND_PROXY).toBe('boolean');
		expect(typeof HOSTNAME).toBe('string');
		expect(typeof ORIGIN).toBe('string');
	});
};

describe('config', () => {
	configTest(config);
});

describe('sample config', () => {
	configTest(sampleConfig);
});
