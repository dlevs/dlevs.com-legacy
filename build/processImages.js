const { promisify } = require('util');
const sharp = require('sharp');
const path = require('path');
const set = require('lodash/set');
const eachLimit = promisify(require('async').eachLimit);
const eachSeries = promisify(require('async').eachSeries);
const glob = promisify(require('glob'));
const fs = require('fs-extra');
const readExif = require('exif-reader');
const ProgressBar = require('progress');
const { toFixedTrimmed } = require('../lib/numberUtils');
const { createGoogleMapsLink } = require('../lib/gpsUtils');
const { root, relativeToRoot } = require('../lib/pathUtils');

(async () => {
	const imageData = await fs.readJson(root('data/generated/images.json')).catch(() => ({}));

	const imageFormats = [
		{
			type: 'large',
			format: 'jpeg',
			size: 2000,
			quality: 80,
		},
		{
			type: 'default',
			format: 'jpeg',
			size: 960,
			quality: 80,
		},
		{
			type: 'largeWebp',
			format: 'webp',
			size: 2000,
			quality: 80,
		},
		{
			type: 'defaultWebp',
			format: 'webp',
			size: 960,
			quality: 80,
		},
	];

	const createWebPath = filepath =>
		`/${relativeToRoot(filepath)}`;

	const isFileNew = filepath =>
		imageData[createWebPath(filepath)] === undefined;

	const processImage = async ({
		type, filepath, format, size, quality,
	}) => {
		const sharpFile = sharp(filepath);
		const outputPathParts = path.parse(filepath.replace('/images/', '/publicDist/images/'));

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

		set(
			imageData,
			[createWebPath(filepath), type],
			{
				width,
				height,
				format,
				src: createWebPath(outputPath.replace('/publicDist', '')),
				paddingBottom: `${toFixedTrimmed(((height / width) * 100), 4)}%`,
			},
		);
	};

	const processImages = async (pattern) => {
		const allFilepaths = await glob(pattern);
		// eslint-disable-next-line no-console
		console.log(`${allFilepaths.length} image files found`);
		const filepaths = allFilepaths.filter(isFileNew);
		// eslint-disable-next-line no-console
		console.log(`${filepaths.length} images are new`);

		if (!filepaths.length) return;

		const progress = new ProgressBar('[:bar] :percent', {
			total: filepaths.length * (1 + imageFormats.length),
		});

		await eachLimit(filepaths, 8, async (filepath) => {
			const sharpFile = sharp(filepath);
			const meta = await sharpFile.metadata();

			if (meta.exif) {
				const exif = readExif(meta.exif);

				if (exif && exif.gps) {
					set(
						imageData,
						[createWebPath(filepath), 'mapLink'],
						createGoogleMapsLink(exif.gps),
					);
				}
			}
			progress.tick();

			await eachSeries(imageFormats, async (format) => {
				await processImage({ ...format, filepath });
				progress.tick();
			});
		});

		const metaOutputPath = root('./data/generated/images.json');
		// eslint-disable-next-line no-console
		console.log(`Writing image meta data to ${metaOutputPath}`);
		fs.writeFile(metaOutputPath, JSON.stringify(imageData, null, '\t'));
	};

	await processImages(root('./images/**/*.+(png|jpg)'));
})();
