const {promisify} = require('util');
const sharp = require('sharp');
const path = require('path');
const mkdirp = promisify(require('mkdirp'));
const eachLimit = promisify(require('async').eachLimit);
const svgo = new (require('svgo'))({
	removeTitle: true,
	removeXMLNS: true,
	removeViewBox: true,
	transformsWithOnePath: true,
	removeAttrs: true,
	removeStyleElement: true,
	removeScriptElement: true
});
const glob = promisify(require('glob'));
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async () => {
	const filepaths = await glob('./images/**/*.+(png|jpg)');
	const fileExtRegex = /\.(png|jpg|jpeg)/;

	await eachLimit(filepaths, 4, async (filepath) => {
		console.log(`Processing ${filepath}`);

		const outputFilepath = filepath.replace('/images', '/public-dist/images');
		await mkdirp(path.dirname(outputFilepath));


		// Save compressed full-size version
		sharp(filepath)
			.withoutEnlargement()
			.resize(3000)
			.max()
			.jpeg({quality: 80})
			.toFile(outputFilepath.replace(fileExtRegex, '_large.jpg'));


		// Save compressed, reduced-size versions
		const sharpFileResized = sharp(filepath)
			.withoutEnlargement()
			.resize(960)
			.max();

		sharpFileResized
			.jpeg({quality: 80})
			.toFile(outputFilepath.replace(fileExtRegex, '.jpg'));

		sharpFileResized
			.webp({quality: 85})
			.toFile(outputFilepath.replace(fileExtRegex, '.webp'));

	});
})();

(async () => {
	const filepaths = await glob('./images/brands/*.svg');

	filepaths.forEach(async (filepath) => {
		const file = await readFile(filepath, 'utf8');

		svgo.optimize(file, async (optimisedFile) => {
			const outputFilepath = filepath.replace('/images', '/public-dist/images');
			await mkdirp(path.dirname(outputFilepath));
			await writeFile(outputFilepath, optimisedFile.data);
		});
	});
})();
