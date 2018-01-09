'use strict';

exports.SINGLE_PIXEL_TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
// PAGE_MAX_WIDTH should be same as that from variables.css
exports.PAGE_MAX_WIDTH = 960;
exports.IMG_SRC_PLACEHOLDER = exports.SINGLE_PIXEL_TRANSPARENT;
exports.IMG_SRCSET_PLACEHOLDER = `${exports.IMG_SRC_PLACEHOLDER} 1w`;
exports.IMG_FULLWIDTH_SIZES = `(min-width: ${exports.PAGE_MAX_WIDTH}px) ${exports.PAGE_MAX_WIDTH}px, 100vw`;
exports.SECONDS_IN_A_DAY = 24 * 60 * 60;
exports.STATIC_ASSET_MAX_AGE_IN_SECONDS = process.env.NODE_ENV === 'production'
	? 30 * exports.SECONDS_IN_A_DAY
	: 0;
exports.SITE_NAME = 'Daniel Levett';
exports.SITE_AUTHOR = 'Daniel Levett';
exports.SITE_LOCALE = 'en_GB';
exports.SITE_IMAGE = '/images/favicon/wide.png';
