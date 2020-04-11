/* This script adds new blog entries to the travel blog JSON.
 *
 * It adds filepaths for all images found in the directories provided,
 * and blank boilerplate properties to reduce the amount of copy/ paste
 * needed to create a blog post.
 *
 * Command line usage (one location):
 * node build/addTravelBlogImages.js ./publicSrc/process/media/travel/japan/tokyo
 *
 * Command line usage (all locations in a country):
 * node build/addTravelBlogImages.js ./publicSrc/process/media/travel/japan/*
 */

// Dependencies
//------------------------------------
import { promisify } from 'util';
import capitalize from 'lodash/capitalize';
import fs from 'fs-extra';
import path from 'path';
import readExif from 'exif-reader';
import sharp from 'sharp';
import moment from 'moment';
import { createWebPath } from './buildUtils';
import globRaw from 'glob'

const glob = promisify(globRaw);

// Functions
//------------------------------------
const getImageExif = async (filepath) => {
	const image = sharp(filepath);
	const { exif } = await image.metadata();
	return readExif(exif);
};

const getImageFormattedDate = async (filepath) => {
	const { exif } = await getImageExif(filepath);
	return moment(exif.DateTimeOriginal).format('YYYY-MM-DD');
};

const getImagesDataForDirectory = async (dirpath) => {
	const pathParts = dirpath.split(path.sep);
	const town = capitalize(pathParts.pop());
	const country = capitalize(pathParts.pop());
	const imageGlob = path.join(dirpath, '*.jpg');
	const imagePaths = await glob(imageGlob);

	return {
		country,
		town,
		date: await getImageFormattedDate(imagePaths[0]),
		images: imagePaths.map(imagePath => ({
			src: createWebPath(imagePath),
			caption: '',
			alt: '',
		})),
	};
};

const addImages = async (sourceFilepath, newImageDirectories) => {
	const newEntries = await Promise.all(newImageDirectories.map(getImagesDataForDirectory));
	const existingEntries = require(sourceFilepath); // eslint-disable-line
	const combinedEntries = [
		...newEntries,
		...existingEntries,
	];

	fs.writeFile(
		sourceFilepath,
		`${JSON.stringify(combinedEntries, null, '\t')}\n`,
	);
};


// Init from command line arguments
//------------------------------------
addImages(
	path.join(__dirname, '../data/travelPostsRaw.json'),
	process.argv.slice(2),
);
