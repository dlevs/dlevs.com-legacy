'use strict';

const mapValues = require('lodash/mapValues');
const media = require('../data/generated/media');
const { ORIGIN } = require('../config');
const { getRevvedPath } = require('./assetUtils');

exports.createImgSrcset = (...images) =>
	images.map(({ src, width }) => `${src} ${width}w`).join(', ');

/**
 * For a filepath, get meta for all versions of that image.
 *
 * @param {String} filepath
 * @returns {Object|null}
 */
exports.getMediaMeta = (filepath) => {
	const meta = media[filepath];

	if (meta) {
		return {
			...meta,
			versions: mapValues(
				meta.versions,
				(version) => {
					const revvedSrc = getRevvedPath(version.src);
					return {
						...version,
						src: revvedSrc,
						absoluteSrc: `${ORIGIN}${revvedSrc}`,
					};
				},
			),
		};
	}

	// eslint-disable-next-line no-console
	console.error(`Media meta not found for filepath ${filepath}`);
	return null;
};
