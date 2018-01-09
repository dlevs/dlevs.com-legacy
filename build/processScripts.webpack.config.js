'use strict';

// This file exports a webpack config for compiling the
// frontend JS into a single file.
//
// Usage:
// webpack --config <path-to-this-file>

require('../config').setProcessEnv();

const webpack = require('webpack');
const { root } = require('../lib/pathUtils');

const isDebug = process.env.NODE_ENV !== 'production';

const config = {
	entry: root('./scripts/main.js'),
	output: {
		path: root('./public/scripts'),
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
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),
	],
};

if (!isDebug) {
	config.plugins = config.plugins.concat([
		new webpack.optimize.UglifyJsPlugin(),
	]);
}

module.exports = config;
