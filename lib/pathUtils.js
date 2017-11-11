// @flow

const path = require('path');

exports.root = (...args: Array<string>): string =>
	path.resolve(__dirname, '../', ...args);

exports.relativeToRoot = (filepath: string): string =>
	path.relative(exports.root('./'), filepath);
