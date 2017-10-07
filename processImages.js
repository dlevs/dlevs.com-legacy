const {promisify} = require('util');
const sharp = require('sharp');
const path = require('path');
const set = require('lodash/set');
const eachLimit = promisify(require('async').eachLimit);
const glob = promisify(require('glob'));
const fs = require('fs-extra');
const readExif = require('exif-reader');
const ProgressBar = require('progress');
const svgo = new (require('svgo'))({
	removeTitle: true,
	removeXMLNS: true,
	removeViewBox: true,
	transformsWithOnePath: true,
	removeAttrs: true,
	removeStyleElement: true,
	removeScriptElement: true
});
const {toFixedTrimmed} = require('./lib/numberUtils');
const {createGoogleMapsLink} = require('./lib/gpsUtils');

let imageData;
try {
	imageData = require('./data/generated/images');
} catch (err) {
	imageData = {};
}

const stripLeadingDot = (str) => str.replace(/^\./, '');

const processImage = async ({type, filepath, format, size, quality}) => {
	const sharpFile = sharp(filepath);
	const outputPathParts = path.parse(filepath.replace('/images/', '/public-dist/images/'));

	// Remove base, so path.format() will use the specified extension
	delete outputPathParts.base;

	await fs.ensureDir(outputPathParts.dir);

	sharpFile
		.withoutEnlargement()
		.resize(size)
		.max();

	const {width, height} = await sharpFile
		.toBuffer({resolveWithObject: true})
		.then(({info}) => info);

	const outputPath = path.format({
		...outputPathParts,
		name: `${outputPathParts.name}_${width}x${height}`,
		ext: '.' + format.replace(/^jpeg$/, 'jpg')
	});

	// Dynamically call function for file format.
	// e.g. sharpFile.jpeg({...}).toFile(...);
	sharpFile[format]({quality}).toFile(outputPath);

	set(
		imageData,
		[stripLeadingDot(filepath), type],
		{
			width,
			height,
			format,
			src: outputPath.replace('./public-dist', ''),
			paddingBottom: toFixedTrimmed(((height / width) * 100), 4) + '%'
		}
	);
};

const processImages = async () => {
	const allFilepaths = await glob('./images/**/*.+(png|jpg)');
	console.log(`${allFilepaths.length} image files found`);

	const filepaths = allFilepaths.filter(
		(filepath) => imageData[stripLeadingDot(filepath)] === undefined
	);
	console.log(`${filepaths.length} images are new`);

	if (!filepaths.length) return;

	const progress = new ProgressBar('[:bar] :percent%', {
		total: filepaths.length * 5
	});

	await eachLimit(filepaths, 8, async (filepath) => {
		const sharpFile = sharp(filepath);
		const meta = await sharpFile.metadata();

		if (meta.exif) {
			const exif = readExif(meta.exif);

			if (exif && exif.gps) {
				set(
					imageData,
					[stripLeadingDot(filepath), 'mapLink'],
					createGoogleMapsLink(exif.gps)
				);
			}
		}
		progress.tick();

		await processImage({
			type: 'large',
			filepath,
			format: 'jpeg',
			size: 2000,
			quality: 80
		});
		progress.tick();

		await processImage({
			type: 'default',
			filepath,
			format: 'jpeg',
			size: 960,
			quality: 80
		});
		progress.tick();

		await processImage({
			type: 'largeWebp',
			filepath,
			format: 'webp',
			size: 2000,
			quality: 80
		});
		progress.tick();

		await processImage({
			type: 'defaultWebp',
			filepath,
			format: 'webp',
			size: 960,
			quality: 80
		});
		progress.tick();
	});

	const metaOutputPath = './data/generated/images.json';
	console.log(`Writing image meta data to ${metaOutputPath}`);
	fs.writeFile(metaOutputPath, JSON.stringify(imageData, null, '\t'));
};

const processSvgs = async () => {
	const filepaths = await glob('./images/brands/*.svg');

	filepaths.forEach(async (filepath) => {
		const file = await fs.readFile(filepath, 'utf8');

		svgo.optimize(file, async (optimisedFile) => {
			const outputFilepath = filepath.replace('/images', '/public-dist/images');
			await fs.ensureDir(path.dirname(outputFilepath));
			await fs.writeFile(outputFilepath, optimisedFile.data);
		});
	});
};

processImages();
processSvgs();
