const mapValues = require('lodash/mapValues');
const imageMeta = require('../data/generated/images');
const { ORIGIN } = require('../config');
const { getRevvedPath } = require('./assetUtils');

exports.createImgSrcset = (...images) =>
	images.map(({ src, width }) => `${src} ${width}w`).join(', ');

/**
 * For a filepath, get meta for all versions of that image.
 *
 * @param {String} filepath
 */
exports.getImageMeta = (filepath) => {
	if (imageMeta[filepath]) {
		return mapValues(
			imageMeta[filepath],
			(img) => {
				if (img.src) {
					const revvedSrc = getRevvedPath(img.src);
					return {
						...img,
						src: revvedSrc,
						absoluteSrc: `${ORIGIN}${revvedSrc}`,
					};
				}
				return img;
			},
		);
	}

	// eslint-disable-next-line no-console
	console.error(`Image meta not found for filepath ${filepath}`);
	return null;
};
