'use strict';

import fs from 'fs-extra';
import path from 'path';
import Svgo from 'svgo';
import { createOutputPath, createWebPath } from './buildUtils';

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

export default processSvgs;
