'use strict';

const { promisify } = require('util');
const fs = require('fs-extra');
const glob = promisify(require('glob'));
const ProgressBar = require('progress');
const mapLimit = promisify(require('async').mapLimit);
const chalk = require('chalk');

const { root, relativeToRoot } = require('../lib/pathUtils');
const { toFixedTrimmed } = require('../lib/numberUtils');

// TODO: Tidy up const and exports. No exports where they are not needed.
exports.MEDIA_TO_PROCESS_ROOT = root('./publicSrc/+(process|processUncommitted)/media');
exports.PUBLIC_SRC_REGEX = new RegExp('/publicSrc/.*?/');
const FILEPATH_MEDIA_JSON = root('./data/generated/media.json');
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

// TODO: Move me
const createLogger = name => new Proxy(console, {
	get(obj, logLevel) {
		return (...args) => {
			let method = logLevel;
			let messages = args;
			let color;

			if (logLevel === 'success') {
				method = 'log';
				color = 'green';
			}

			if (color) {
				messages = messages.map(message => chalk[color](message));
			}

			obj[method](
				chalk.cyan(`[${name}]`),
				...messages,
			);
		};
	},
});

const addMedia = async (fileType, processFile, globPattern) => {
	const logger = createLogger(fileType);
	const media = await getMedia();
	const allFilepaths = await glob(globPattern);
	const filepaths = allFilepaths.filter((filepath) => {
		const webPath = exports.createWebPath(filepath);
		return media[webPath] === undefined;
	});
	const progress = new ProgressBar('[:bar] :percent', {
		total: filepaths.length,
		clear: true,
	});

	logger.log(`${allFilepaths.length} files found`);
	logger.log(`${filepaths.length} files are new`);

	if (!filepaths.length) {
		logger.success('No action taken');
		return;
	}

	const newMedia = await mapLimit(
		filepaths,
		MAX_FILES_PROCESS_CONCURRENTLY,
		async (filepath) => {
			const outputData = await processFile(filepath);
			progress.tick();
			return {
				[exports.createWebPath(filepath)]: outputData,
			};
		},
	);

	await fs.writeJson(
		FILEPATH_MEDIA_JSON,
		Object.assign(
			{},
			media,
			...newMedia,
		),
		{ spaces: '\t' },
	);

	logger.success(`${filepaths.length} files successfully processed`);
};

// TODO: Tidy up the exports of this file. Maybe rename file.
exports.addMedia = addMedia;
