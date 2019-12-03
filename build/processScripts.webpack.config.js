'use strict';

// This file exports a webpack config for compiling the
// frontend JS into a single file.
//
// Usage:
// webpack --config <path-to-this-file>

// TODO: load .env here?
const path = require('path')
const isDebug = process.env.NODE_ENV !== 'production';

module.exports = {
	entry: path.join(__dirname, '../publicSrc/scripts/main.ts'),
	output: {
		path: path.join(__dirname, '../public/scripts'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: 'babel-loader',
			},
		],
	},
	performance: {
		maxEntrypointSize: isDebug
			// 1MB for development, including sourcemaps
			? 1000000
			// 80KB for production, after compression
			: 80000,
	},
	devtool: isDebug ? 'module-inline-source-map' : false,
	mode: process.env.NODE_ENV,
};
