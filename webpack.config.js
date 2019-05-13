/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/1/29 (2019/4/18).
 */
"use strict";

const path = require('path');
const camelCase = require('lodash.camelcase')
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');

const libraryName = 'live-editor';
const libVarName = camelCase(libraryName)

module.exports = {
	target: 'node',
	entry: `./src/main.ts`,
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	externals: [nodeExternals()],
	output: {
		filename: 'bundle.umd.js',
		path: './dist',
		library: libVarName,
		libraryTarget: 'umd',
	},
	watchOptions: {
		ignored: ['node_modules', 'dist']
	},
	plugins: [
		new webpack.BannerPlugin({banner: "#!/usr/bin/env node", raw: true})
	],
	optimization: {
		minimizer: [new TerserPlugin({sourceMap: true})]
	},
};
