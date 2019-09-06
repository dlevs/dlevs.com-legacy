'use strict';

const fs = require('fs-extra');
const path = require('path');
const Svgo = require('svgo');
const { createOutputPath, createWebPath } = require('./buildUtils');

const svgo = new Svgo();

const processSvgs = async (filepath) => {
	const file = await fs.readFile(filepath, 'utf8');
	const { data } = await svgo.optimize(file);
	const outputFilepath = createOutputPath(filepath);

	await fs.ensureDir(path.dirname(outputFilepath));
	await fs.writeFile(outputFilepath, data);

	return {
		type: 'svg',
		versions: {
			default: { src: createWebPath(filepath) },
		},
	};
};

module.exports = processSvgs;
