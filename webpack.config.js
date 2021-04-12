const path = require('path')

module.exports = {
	entry: './lib/slider/slider-open-question-view.js',
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules)/,
				use: {
						loader: 'babel-loader'
				}
			}
		]
	},
	output: {
		path: path.resolve(__dirname, 'runtime'),
		filename: 'slider-open_bundle.js'
	}
}