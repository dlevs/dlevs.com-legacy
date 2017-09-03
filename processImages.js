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
	jpeg: 'jpg',
	webp: 'webp',
	png: 'png'
};

// TODO: Move to utis file
const stripZerosFromDecimalString = (str) => str
	// Remove zeros after decimal place
	.replace(/(\..*?)(0+)$/, '$1')
	// Remove decimal place if it's now at the end
	.replace(/\.$/, '');

const addToImageData = (filepath, data) => {
	const {width, height} = data;
	filepath = filepath.replace(/^\./, '');

	data.paddingBottom = stripZerosFromDecimalString(
		((height / width) * 100).toFixed(4)
	) + '%';

	imageData[filepath] = imageData[filepath] || [];
	imageData[filepath].push(data);
};

const processImage = async ({filepath, format, size, quality}) => {
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

	sharpFile
		[format]({quality})
		.toFile(path.format({
			...outputPathParts,
			ext: EXTENSIONS_BY_FORMAT[format]
		}));

	addToImageData(filepath, {width, height, format});
};

const processImages = async () => {
	const filepaths = await glob('./images/**/*.+(png|jpg)');

	await eachLimit(filepaths, 4, async (filepath) => {
		console.log(`Processing: ${filepath}`);

		await processImage({
			filepath,
			format: 'jpeg',
			size: 3000,
			quality: 80
		});
		await processImage({
			filepath,
			format: 'jpeg',
			size: 960,
			quality: 80
		});
		await processImage({
			filepath,
			format: 'webp',
			size: 960,
			quality: 85
		});
	});

	fs.writeFile('./images/meta.json', JSON.stringify(imageData, null, '\t'));
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
