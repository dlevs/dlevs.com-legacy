// @flow

exports.SINGLE_PIXEL_TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
// PAGE_MAX_WIDTH should be same as that from variables.css
exports.PAGE_MAX_WIDTH = 960;
exports.IMG_SRC_PLACEHOLDER = exports.SINGLE_PIXEL_TRANSPARENT;
exports.IMG_SRCSET_PLACEHOLDER = `${exports.IMG_SRC_PLACEHOLDER} 1w`;
exports.IMG_FULLWIDTH_SIZES = `(min-width: ${exports.PAGE_MAX_WIDTH}px) ${exports.PAGE_MAX_WIDTH}px, 100vw`;
