const path = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const root = (...args) => path.resolve(__dirname, ...args);

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
		new webpack.optimize.UglifyJsPlugin({minimize: true}),
		new WebpackAssetsManifest({
			output: root('./data/generated/assets.json'),
			merge: true
		})
	]
};
