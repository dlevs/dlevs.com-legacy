'use strict';

const { promisify } = require('util');
const sharp = require('sharp');
const path = require('path');
const set = require('lodash/set');
const eachLimit = promisify(require('async').eachLimit);
const mapSeries = promisify(require('async').mapSeries);
const glob = promisify(require('glob'));
const fs = require('fs-extra');
const readExif = require('exif-reader');
const ProgressBar = require('progress');
const { createGoogleMapsLink } = require('../lib/gpsUtils');
const { root } = require('../lib/pathUtils');
const {
	MEDIA_TO_PROCESS_ROOT,
	createOutputPath,
	createWebPath,
	getPaddingBottom,
	mediaData,
	isFileNew,
} = require('./buildUtils');

const QUALITY = 80;
const SIZE_MEDIUM = 960;
const SIZE_LARGE = 2000;

const imageFormats = {
	large: {
		format: 'jpeg',
		size: SIZE_LARGE,
		quality: QUALITY,
	},
	default: {
		format: 'jpeg',
		size: SIZE_MEDIUM,
		quality: QUALITY,
	},
	largeWebp: {
		format: 'webp',
		size: SIZE_LARGE,
		quality: QUALITY,
	},
	defaultWebp: {
		format: 'webp',
		size: SIZE_MEDIUM,
		quality: QUALITY,
	},
};

const convertImage = async ({
	filepath, format, size, quality,
}) => {
	const sharpFile = sharp(filepath);
	const outputPathParts = path.parse(createOutputPath(filepath));

	// Remove base, so path.format() will use the specified extension
	delete outputPathParts.base;

	await fs.ensureDir(outputPathParts.dir);

	sharpFile
		.withoutEnlargement()
		.resize(size)
		.max();

	const { width, height } = await sharpFile
		.toBuffer({ resolveWithObject: true })
		.then(({ info }) => info);

	const outputPath = path.format({
		...outputPathParts,
		name: `${outputPathParts.name}_${width}x${height}`,
		ext: `.${format.replace(/^jpeg$/, 'jpg')}`,
	});

	// Dynamically call function for file format.
	// e.g. sharpFile.jpeg({...}).toFile(...);
	await sharpFile[format]({ quality }).toFile(outputPath);

	return {
		width,
		height,
		format,
		src: createWebPath(outputPath),
		paddingBottom: getPaddingBottom(width, height),
	};
};

const processImage = async (filepath) => {
	const sharpFile = sharp(filepath);
	const meta = await sharpFile.metadata();

	if (meta.exif) {
		const exif = readExif(meta.exif);

		if (exif && exif.gps) {
			set(
				mediaData,
				[createWebPath(filepath), 'mapLink'],
				createGoogleMapsLink(exif.gps),
			);
		}
	}

	const foo = await mapSeries(imageFormats, (format) => {
		convertImage({ ...format, filepath });
	});

};
