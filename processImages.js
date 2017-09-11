const {promisify} = require('util');
const sharp = require('sharp');
const path = require('path');
const eachLimit = promisify(require('async').eachLimit);
const glob = promisify(require('glob'));
const fs = require('fs-extra');
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

	data.paddingBottom = toFixedTrimmed(((height / width) * 100), 4) + '%';

	imageData[filepath] = imageData[filepath] || {};
	imageData[filepath][type] = data;
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

const processImages = async () => {
	const filepaths = await glob('./images/**/*.+(png|jpg)');

	await eachLimit(filepaths, 8, async (filepath) => {
		console.log(`Processing: ${filepath}`);

		await processImage({
			type: 'large',
			filepath,
			format: 'jpeg',
			size: 2000,
			quality: 80
		});
		await processImage({
			type: 'default',
			filepath,
			format: 'jpeg',
			size: 960,
			quality: 80
		});
		await processImage({
			type: 'webp',
			filepath,
			format: 'webp',
			size: 960,
			quality: 85
		});
	});

	fs.writeFile('./data/generated/images.json', JSON.stringify(imageData, null, '\t'));
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
