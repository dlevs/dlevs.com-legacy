'use strict';

const { promisify } = require('util');
const fs = require('fs-extra');
const glob = promisify(require('glob'));
const ProgressBar = require('progress');
const mapLimit = promisify(require('async').mapLimit);
const set = require('lodash/set');

const { root, relativeToRoot } = require('../lib/pathUtils');
const { toFixedTrimmed } = require('../lib/numberUtils');

// TODO: Tidy up const and exports. No exports where they are not needed.
exports.MEDIA_TO_PROCESS_ROOT = root('./publicSrc/+(process|processUncommitted)/media');
exports.PUBLIC_SRC_REGEX = new RegExp('/publicSrc/.*?/');
const FILEPATH_MEDIA_JSON = '../data/generated/media.json';
const MAX_FILES_PROCESS_CONCURRENTLY = 8;
exports.createWebPath = filepath => `/${relativeToRoot(filepath)}`
	.replace('/public/', '/')
	.replace(exports.PUBLIC_SRC_REGEX, '/');
exports.createOutputPath = filepath => filepath
	.replace(exports.PUBLIC_SRC_REGEX, '/public/');
exports.getPaddingBottom = (width, height) =>
	`${toFixedTrimmed(((height / width) * 100), 4)}%`;


const getMedia = async () => {
	try {
		return await fs.readJson(FILEPATH_MEDIA_JSON);
	} catch (err) {
		return {};
	}
};

const createLogger = name => new Proxy(console, {
	get(obj, prop) {
		return (...args) => obj[prop](`[${name}]`, ...args);
	},
});

const addMedia = async (globPattern, processFile) => {
	const logger = createLogger(`${processFile.type} files`);
	const media = await getMedia();
	const allFilepaths = await glob(globPattern);
	const filepaths = allFilepaths.filter((filepath) => {
		const webPath = exports.createWebPath(filepath);
		return media[webPath] === undefined;
	});
	const progress = new ProgressBar('[:bar] :percent', {
		total: filepaths.length,
	});

	logger.log(`${allFilepaths.length} files found`);
	logger.log(`${filepaths.length} files are new`);

	if (!filepaths.length) return;

	// const addFile = (filepath, type, data) => {
	// 	set(media, [filepath, type], data);
	// };

	const newMedia = await mapLimit(
		filepaths,
		MAX_FILES_PROCESS_CONCURRENTLY,
		async (filepath) => {
			const result = await processFile(filepath);
			progress.tick();
			return result;
		},
	);

	console.log(newMedia);

	// await fs.writeJson(FILEPATH_MEDIA_JSON, {
	// 	...media,
	// 	...newMedia
	// });
};

// TODO: Tidy up the exports of this file. Maybe rename file.
exports.addMedia = addMedia;
