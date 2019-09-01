'use strict';

import path from 'path';

exports.root = (...args: string[]) =>
	path.resolve(__dirname, '../', ...args);

exports.relativeToRoot = (filepath: string) =>
	path.relative(exports.root('./'), filepath);
