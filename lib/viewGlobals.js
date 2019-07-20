'use strict';

const CONSTANTS = require('./constants');
const HELPERS = require('./viewHelpers');
const ICONS = require('feather-icons').icons;

module.exports = {
	HELPERS,
	ICONS,
	GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
	CONSTANTS,
	DEBUG: process.env.NODE_ENV !== 'production',
};
