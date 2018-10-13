'use strict';

exports.SINGLE_PIXEL_TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
exports.REGULAR_IMAGE_WIDTH = 960;
exports.IMG_SRC_PLACEHOLDER = exports.SINGLE_PIXEL_TRANSPARENT;
exports.IMG_SRCSET_PLACEHOLDER = `${exports.IMG_SRC_PLACEHOLDER} 1w`;
exports.IMG_FULLWIDTH_SIZES = `(min-width: ${exports.REGULAR_IMAGE_WIDTH}px) ${exports.REGULAR_IMAGE_WIDTH}px, 100vw`;
exports.SECONDS_IN_A_DAY = 24 * 60 * 60;
exports.SITE_NAME = 'Daniel Levett';
exports.SITE_LOCALE = 'en-GB';
exports.SITE_IMAGE = '/media/favicon/wide.png';
