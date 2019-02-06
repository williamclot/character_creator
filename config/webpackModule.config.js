const { appIndexJs, appDist } = require('./paths')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")

process.env.NODE_ENV = 'production'

const postCssLoader = {
    // Options for PostCSS as we reference these options twice
    // Adds vendor prefixing based on your specified browser support in
    // package.json
    loader: require.resolve('postcss-loader'),
    options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
            }),
        ]
    },
}

module.exports = {
    entry: appIndexJs,
    output: {
        filename: 'index.js',
        path: appDist,

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
                    'css-loader',
                    postCssLoader
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
        'react-dom': 'react-dom'
    }
}
