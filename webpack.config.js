/* eslint import/no-extraneous-dependencies:0 */
const config = require('config');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: './src/client/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.vue', '.js', '.json'],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 400 * 1024,
    },
    stats: {
        children: false,
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env.SOCKET_URL': `"${config.get('socketUrl')}"`,
        }),
        new CopyWebpackPlugin([{
            from: 'node_modules/monaco-editor/min/vs',
            to: 'vendor/vs',
        }]),
    ],
};
