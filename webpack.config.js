require('./config').setProcessEnv();

const path = require('path');
const assert = require('assert');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const root = (...args) => path.resolve(__dirname, ...args);

assert(
	typeof process.env.NODE_ENV === 'string',
	'process.env.NODE_ENV must be defined'
);

module.exports = {
	entry: root('./scripts/main.js'),
	output: {
		path: root('./public-dist/scripts'),
		filename: '[name]-[hash:10].js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new WebpackAssetsManifest({
			output: root('./data/generated/assets.json'),
			merge: true
		})
	]
};
