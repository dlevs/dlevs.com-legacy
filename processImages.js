const {promisify} = require('util');
const sharp = require('sharp');
const path = require('path');
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

const imageData = {};
const EXTENSIONS_BY_FORMAT = {
	jpeg: '.jpg',
	webp: '.webp',
	png: '.png'
};

// TODO: Move to utis file
const toFixedTrimmed = (n, digits) => n
	.toFixed(digits)
	// Remove zeros after decimal place
	.replace(/(\..*?)(0+)$/, '$1')
	// Remove decimal place if it's now at the end
	.replace(/\.$/, '');

const addToImageData = (filepath, type, data) => {
	const {width, height} = data;
	filepath = filepath.replace(/^\./, '');

	imageData[filepath] = imageData[filepath] || {};
	imageData[filepath][type] = {
		...data,
		paddingBottom: toFixedTrimmed(((height / width) * 100), 4) + '%'
	};
};

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
		ext: EXTENSIONS_BY_FORMAT[format]
	});

	// Dynamically call function for file format.
	// e.g. sharpFile.jpeg({...}).toFile(...);
	sharpFile[format]({quality}).toFile(outputPath);

	addToImageData(filepath, type, {
		width,
		height,
		format,
		src: outputPath.replace('./public-dist', ''),
	});
};

const gpsCoordsToString = (coordinates, ref) => {
	const [first, second, third] = coordinates;
	return `${first}°${second}'${third}"${ref}`;
};

const processImages = async () => {
	const filepaths = await glob('./images/**/*.+(png|jpg)');
	const progress = new ProgressBar('[:bar] :percent%', {
		total: filepaths.length * 4
	});

	await eachLimit(filepaths, 8, async (filepath) => {
		const sharpFile = sharp(filepath);
		const meta = await sharpFile.metadata();

		if (meta.exif) {
			const exif = readExif(meta.exif);

			if (exif && exif.gps) {
				addToImageData(filepath, 'gps', {
					...exif.gps,
					googleMapLink: `https://maps.google.com/maps?q=${gpsCoordsToString(exif.gps.GPSLatitude, exif.gps.GPSLatitudeRef)},${gpsCoordsToString(exif.gps.GPSLongitude, exif.gps.GPSLongitudeRef)}`
				});
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
			type: 'webp',
			filepath,
			format: 'webp',
			size: 960,
			quality: 85
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
