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

	// TODO: Don't write this output to media.json. Also, whole shape is no longer needed since we're not trying to mix in with normal images now
	return {
		type: 'svg',
		versions: {
			default: { src: createWebPath(filepath) },
		},
	};
};

export default processSvgs;
