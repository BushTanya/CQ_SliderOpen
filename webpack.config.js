const path = require('path')

module.exports = {
	entry: './entry.js',
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