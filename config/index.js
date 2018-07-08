'use strict';

module.exports = process.env.NODE_ENV === 'test'
	// To keep snapshots consistent between environments,
	// use the same, sample config for all tests.
	? require('./config.sample.js')
	: require('./config.js');
