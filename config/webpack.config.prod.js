const path = require('path')
const { appPath } = require('./paths')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")

process.env.NODE_ENV = 'production'

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(appPath, 'dist'),

        library: 'ReactCustomizer',
        libraryTarget: 'umd'
    },

    mode: 'production',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\//,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'index.css'
        })
    ],

    externals: {
        react: 'react',
        // 'react-dom': 'react-dom'
    }
}
