'use strict';

const { root, relativeToRoot } = require('../lib/pathUtils');
const { toFixedTrimmed } = require('../lib/numberUtils');

let mediaData;
try {
	// eslint-disable-next-line
	mediaData = require('../data/generated/media.json');
} catch (err) {
	mediaData = {};
}

exports.MEDIA_TO_PROCESS_ROOT = root('./publicSrc/+(process|processUncommitted)/media');
exports.PUBLIC_SRC_REGEX = new RegExp('/publicSrc/.*?/');

exports.createWebPath = filepath => `/${relativeToRoot(filepath)}`
	.replace('/public/', '/')
	.replace(exports.PUBLIC_SRC_REGEX, '/');
exports.createOutputPath = filepath => filepath
	.replace(exports.PUBLIC_SRC_REGEX, '/public/');
exports.getPaddingBottom = (width, height) =>
	`${toFixedTrimmed(((height / width) * 100), 4)}%`;
exports.mediaData = mediaData;
exports.isFileNew = filepath =>
	mediaData[exports.createWebPath(filepath)] === undefined;
