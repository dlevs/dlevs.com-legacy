'use strict';

const { promisify } = require('util');
const fs = require('fs-extra');
const path = require('path');
const glob = promisify(require('glob'));
const Svgo = require('svgo');
const { root } = require('../lib/pathUtils');

const svgo = new Svgo();

const processSvgs = async (pattern) => {
	const filepaths = await glob(pattern);

	filepaths.forEach(async (filepath) => {
		const file = await fs.readFile(filepath, 'utf8');
		const { data } = await svgo.optimize(file);
		const outputFilepath = filepath.replace('/images', '/public/images');

		await fs.ensureDir(path.dirname(outputFilepath));
		await fs.writeFile(outputFilepath, data);
	});
};

processSvgs(root('./images/brands/*.svg'));
