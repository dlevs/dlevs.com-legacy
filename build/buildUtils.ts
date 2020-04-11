import { promisify } from 'util';
import fs from 'fs-extra';
import ProgressBar from 'progress';
import chalk from 'chalk';
import { root, relativeToRoot } from '/lib/pathUtils';
import { toFixedTrimmed } from '/lib/numberUtils';
import mapValues from 'lodash/mapValues';
import globRaw from 'glob';
import asyncLib from 'async';

const glob = promisify(globRaw);
const mapLimit = promisify(asyncLib.mapLimit);

const PUBLIC_SRC_REGEX = new RegExp('/publicSrc/.*?/');
// TODO: Rename "media" functions and file. It's now 'images.json', used only for images
const FILEPATH_MEDIA_JSON = root('./data/generated/media.json');
const MAX_FILES_PROCESS_CONCURRENTLY = 8;

/**
 * Create the corresponding output path for any file that is in the
 * "publicSrc" directory, waiting to be processed.
 *
 * The output path will be in the "public" directory, so that it is
 * accessible to the user.
 *
 * createWebPath('/path/to/this/repo/publicSrc/process/media/foo.jpg');
 * // '/path/to/this/repo/public/media/foo.jpg'
 */
export const createOutputPath = (filepath: string) => filepath
	.replace(PUBLIC_SRC_REGEX, '/public/');

/**
 * Create the corresponding web path for any file that is in the
 * "publicSrc" directory OR an already processed file in the "public"
 * directory.
 *
 * The web path is the relative path that can be appended to the
 * site hostname to access the resource.
 *
 * createWebPath('/path/to/this/repo/publicSrc/process/media/foo.jpg');
 * // '/media/foo.jpg'
 */
export const createWebPath = (filepath: string) => `/${relativeToRoot(filepath)}`
	.replace('/public/', '/')
	.replace(PUBLIC_SRC_REGEX, '/');

/**
 * Get the CSS padding-bottom value needed to perform the padding-bottom
 * hack for maintaining the height of an element while it is loading.
 *
 * As described in:
 * http://andyshora.com/css-image-container-padding-hack.html
 */
export const getPaddingBottom = (width: number, height: number) =>
	`${toFixedTrimmed(((height / width) * 100), 4)}%`;

type LogLevelCustom = 'success';
type LogLevelBuiltIn = 'log' | 'error' | 'warn';
type LogLevels = {
	[k in LogLevelCustom | LogLevelBuiltIn]: {
		method: LogLevelBuiltIn;
		applyColor?: (message: string) => string;
	};
}

const logLevels: LogLevels = {
	success: {
		method: 'log',
		applyColor: (message: string) => chalk.green(message),
	},
	log: { method: 'log' },
	warn: { method: 'warn' },
	error: { method: 'error' },
};

/**
 * A wrapper around console.log.
 *
 * The provided `name` is prepended to all messages.
 *
 * Extra methods are added, like `.success()`, which affects
 * the color of the logged message.
 */
const createLogger = (name: string) => {
	return mapValues(logLevels, ({ method, applyColor }) => {
		return (...args: any[]) => {
			const argsToLog = [
				applyColor ? applyColor(name) : name,
				...args,
			];
			console[method](...argsToLog);
		};
	});
};

/**
 * Get the existing meta JSON object from file, or an empty object if it
 * doesn't exist.
 */
const getMedia = async () => {
	try {
		return await fs.readJson(FILEPATH_MEDIA_JSON);
	} catch (err) {
		return {};
	}
};

/**
 * Process all files that match `globPattern` by passing them through
 * `processFile`, which must return a promise that resolves to an
 * object with meta data about any output files that may have been
 * produced from the input file.
 *
 * This meta data is added to a JSON file for reference later.
 *
 * Example of an object `processFile` may return:
 * {
 *     type: 'image',
 *     versions: {
 *         default: { 'src': '/foo.jpg', width: 400, height: 300 },
 *         large: { 'src': '/foo-large.jpg', width: 600, height: 450 },
 *     },
 * }
 */
export const addMedia = async (
	fileType: string,
	processFile,
	globPattern: string,
) => {
	const logger = createLogger(fileType);
	const media = await getMedia();
	const allFilepaths = await glob(globPattern);
	const filepaths = allFilepaths.filter((filepath) => {
		const webPath = createWebPath(filepath);
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

	logger.log('Processing new files');

	const newMedia = await mapLimit(
		filepaths,
		MAX_FILES_PROCESS_CONCURRENTLY,
		async (filepath) => {
			const outputData = await processFile(filepath);
			progress.tick();
			return {
				[createWebPath(filepath)]: outputData,
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
