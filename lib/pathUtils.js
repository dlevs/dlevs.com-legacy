const path = require('path');
const assets = require('../data/generated/assets.json');

exports.root = (...args) => path.resolve(__dirname, '../', ...args);
exports.relativeToRoot = (filepath) => path.relative(exports.root('./'), filepath);

/**
 * For a given path, get the counterpart that contains a hash in the filename
 * for cache-busting purposes.
 *
 * This feature is production-only as it would be a pain to watch assets for
 * changes, regenerate the assets.json file and restart the server during
 * development.
 *
 * @param {String} filepath
 * @return {String}
 */
exports.getRevvedPath = (filepath) => {
	const revvedPath = assets[filepath];

	if (!revvedPath) {
		console.error(`No revved asset found for path ${filepath}`);
		return filepath;
	}

	if (process.env.NODE_ENV !== 'production') {
		return filepath;
	}

	return revvedPath;
};
