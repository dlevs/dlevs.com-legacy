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

	await eachLimit(filepaths, 4, async (filepath) => {
		console.log(`Processing ${filepath}`);

		const outputFilepath = filepath.replace('/images', '/public-dist/images');
		await mkdirp(path.dirname(outputFilepath));

		const sharpFile = sharp(filepath)
			.withoutEnlargement()
			.resize(960)
			.max();

		sharpFile
			.jpeg({quality: 80})
			.toFile(outputFilepath.replace('.png', '.jpg'));

		sharpFile
			.webp({quality: 85})
			.toFile(outputFilepath.replace(/\.(png|jpg|jpeg)/, '.webp'));

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
