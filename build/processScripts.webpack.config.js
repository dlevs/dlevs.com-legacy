// This file exports a webpack config for compiling the
// frontend JS into a single file.
//
// Usage:
// webpack --config <path-to-this-file>

require('../config').setProcessEnv();

const webpack = require('webpack');
const {root} = require('../lib/pathUtils');

module.exports = {
	entry: root('./scripts/main.js'),
	output: {
		path: root('./public-dist/scripts'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: 'babel-loader'
			}
		]
	},
	devtool: 'module-inline-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		})
	]
};
