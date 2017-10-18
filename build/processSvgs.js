const {promisify} = require('util');
const fs = require('fs-extra');
const path = require('path');
const glob = promisify(require('glob'));
const svgo = new (require('svgo'))({
	removeTitle: true,
	removeXMLNS: true,
	removeViewBox: true,
	transformsWithOnePath: true,
	removeAttrs: true,
	removeStyleElement: true,
	removeScriptElement: true
});

const processSvgs = async () => {
	const filepaths = await glob('../images/brands/*.svg');

	filepaths.forEach(async (filepath) => {
		const file = await fs.readFile(filepath, 'utf8');

		svgo.optimize(file, async (optimisedFile) => {
			const outputFilepath = filepath.replace('/images', '/public-dist/images');
			await fs.ensureDir(path.dirname(outputFilepath));
			await fs.writeFile(outputFilepath, optimisedFile.data);
		});
	});
};

processSvgs();
