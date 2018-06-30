'use strict';

const {
	setProcessEnv,
	PORT,
	GOOGLE_ANALYTICS_ID,
	IS_BEHIND_PROXY,
	HOSTNAME,
	ORIGIN,
} = require('./config');

describe('config', () => {
	test('setProcessEnv()', () => {
		expect(typeof setProcessEnv).toBe('function');
		setProcessEnv();
		expect(process.env.NODE_ENV).toMatch(/^development$|^production$/);
	});

	test('expected contstants', () => {
		expect(typeof PORT).toBe('number');
		expect(typeof GOOGLE_ANALYTICS_ID === 'string' || GOOGLE_ANALYTICS_ID === null).toBe(true);
		expect(typeof IS_BEHIND_PROXY).toBe('boolean');
		expect(typeof HOSTNAME).toBe('string');
		expect(typeof ORIGIN).toBe('string');
	});
});
