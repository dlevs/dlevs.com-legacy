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
	STATIC_ASSET_MAX_AGE_IN_SECONDS,
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
		expect(typeof STATIC_ASSET_MAX_AGE_IN_SECONDS).toBe('number');
		expect(STATIC_ASSET_MAX_AGE_IN_SECONDS).toBeGreaterThanOrEqual(0);
	});
};

describe('config', () => {
	configTest(config);
});

describe('sample config', () => {
	configTest(sampleConfig);
});

describe('index', () => {
	beforeEach(() => {
		process.env.NODE_ENV = 'test';
		jest.resetModules();
	});
	test('is test config when in test mode', () => {
		// eslint-disable-next-line global-require
		expect(require('../config')).toBe(require('./config.sample.js'));
	});
	describe('is real config when not in test mode', () => {
		['production', 'development', 'somesillyvalue'].forEach((environment) => {
			test(environment, () => {
				process.env.NODE_ENV = environment;
				// eslint-disable-next-line global-require
				expect(require('../config')).toBe(require('./config.js'));
			});
		});
	});
});
