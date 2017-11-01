const {GOOGLE_ANALYTICS_ID} = require('../config');
const IMAGE_META = require('../data/generated/images');
const CONSTANTS = require('./constants');
const HELPERS = require('./viewHelpers');
const ICONS = require('feather-icons');

module.exports = {
	HELPERS,
	IMAGE_META,
	ICONS,
	GOOGLE_ANALYTICS_ID,
	CONSTANTS,
	DEBUG: process.env.NODE_ENV !== 'production'
};
