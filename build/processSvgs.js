const { promisify } = require('util');
const fs = require('fs-extra');
const path = require('path');
const glob = promisify(require('glob'));
const Svgo = require('svgo');
const { root } = require('../lib/pathUtils');

const svgo = new Svgo({
	removeTitle: true,
	removeXMLNS: true,
	removeViewBox: true,
	transformsWithOnePath: true,
	removeAttrs: true,
	removeStyleElement: true,
	removeScriptElement: true,
});

const processSvgs = async (pattern) => {
	const filepaths = await glob(pattern);

	filepaths.forEach(async (filepath) => {
		const file = await fs.readFile(filepath, 'utf8');

		svgo.optimize(file, async (optimisedFile) => {
			const outputFilepath = filepath.replace('/images', '/publicDist/images');
			await fs.ensureDir(path.dirname(outputFilepath));
			await fs.writeFile(outputFilepath, optimisedFile.data);
		});
	});
};

processSvgs(root('./images/brands/*.svg'));
