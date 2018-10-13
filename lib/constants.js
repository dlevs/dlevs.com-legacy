'use strict';

exports.SINGLE_PIXEL_TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
exports.IMG_SRC_PLACEHOLDER = exports.SINGLE_PIXEL_TRANSPARENT;
exports.IMG_SRCSET_PLACEHOLDER = `${exports.IMG_SRC_PLACEHOLDER} 1w`;

// This breakpoint comes from structure.css. 75vw accounts for the padding of site wrapper.
// If making changes, change there too.
exports.IMG_FULLWIDTH_SIZES = '(min-width: 1000px) 75vw, 100vw';

exports.SECONDS_IN_A_DAY = 24 * 60 * 60;
exports.SITE_NAME = 'Daniel Levett';
exports.SITE_LOCALE = 'en-GB';
exports.SITE_IMAGE = '/media/favicon/wide.png';
