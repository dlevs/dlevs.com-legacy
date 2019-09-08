'use strict';

import { promisify } from 'util';
import sharp from 'sharp';
import path from 'path';
const mapValuesSeries = promisify(require('async').mapValuesSeries);
import fs from 'fs-extra';
import readExif from 'exif-reader';
import { createGoogleMapsLink } from '/lib/gpsUtils';
const {
	createOutputPath,
	createWebPath,
	getPaddingBottom,
} = require('./buildUtils');

const QUALITY = 80;
const SIZE_MEDIUM = [960];
const SIZE_LARGE = [2000, 800];
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

const createOutputFile = async ({
	filepath, format, size, quality,
}) => {
	const sharpFile = sharp(filepath);
	const outputPathParts = path.parse(createOutputPath(filepath));

	// Remove base, so path.format() will use the specified extension
	delete outputPathParts.base;

	await fs.ensureDir(outputPathParts.dir);

	sharpFile
		.withoutEnlargement()
		.resize(...size)
		.min();

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
		type: `image/${format}`,
		src: createWebPath(outputPath),
		paddingBottom: getPaddingBottom(width, height),
	};
};

const getMapLink = async (filepath) => {
	const sharpFile = sharp(filepath);
	const meta = await sharpFile.metadata();

	if (meta.exif) {
		const exif = readExif(meta.exif);

		if (exif && exif.gps) {
			return createGoogleMapsLink(exif.gps);
		}
	}

	return null;
};

const processImage = async (filepath) => {
	const versions = await mapValuesSeries(
		imageFormats,
		async format => createOutputFile({ ...format, filepath }),
	);

	return {
		type: 'image',
		mapLink: await getMapLink(filepath),
		versions,
	};
};

export default processImage;
