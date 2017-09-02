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
const createOutputFilepath = (filepath) => {
	const parts = path.parse(filepath);

	// Remove base, so path.format will use the specified extension
	delete parts.base;

	return {
		parts,
		modify: (modifyParts) => path.format({...parts, ...modifyParts(parts)})
	}
};

(async () => {
	const filepaths = await glob('./images/**/*.+(png|jpg)');

	await eachLimit(filepaths, 4, async (filepath) => {
		console.log(`Processing ${filepath}`);

		const outputPath = createOutputFilepath(
			filepath.replace('/images/', '/public-dist/images/')
		);
		const sharpFile = sharp(filepath);
		const sharpFileForResize = sharp(filepath);
		const {width, height} = await sharpFile.metadata();
		const ratio = ((height / width) * 100).toFixed(4);

		await mkdirp(outputPath.parts.dir);

		// Save compressed full-size version
		sharpFile
			.withoutEnlargement()
			.resize(3000)
			.max()
			.jpeg({quality: 80})
			.toFile(outputPath.modify(({name}) => ({
				name: `${ratio}_${name}_large`,
				ext: '.jpg'
			})));


		// Save compressed, reduced-size versions
		sharpFileForResize
			.withoutEnlargement()
			.resize(960)
			.max();

		sharpFileForResize
			.jpeg({quality: 80})
			.toFile(outputPath.modify(({name}) => ({
				name: `${ratio}_${name}`,
				ext: '.jpg'
			})));

		sharpFileForResize
			.webp({quality: 85})
			.toFile(outputPath.modify(({name}) => ({
				name: `${ratio}_${name}`,
				ext: '.webp'
			})));

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
