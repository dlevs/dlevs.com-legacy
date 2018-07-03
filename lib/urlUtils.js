'use strict';

const normalizeUrl = require('normalize-url');

/**
 * Get a normalized version of a URL for canonical purposes.
 *
 * @param {String} url
 */
exports.getCanonicalUrl = url => normalizeUrl(url, {
	removeQueryParameters: ['pretty', 'pid', 'gid'],
});

/**
 * Get a normalized version of a URL for sharing purposes.
 *
 * @param {String} url
 */
exports.getShareUrl = url => normalizeUrl(url, {
	removeQueryParameters: ['pretty'],
});
