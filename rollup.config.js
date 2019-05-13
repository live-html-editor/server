import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import {terser} from "rollup-plugin-terser"
import tempDir from "temp-dir"
import autoExternal from 'rollup-plugin-auto-external';

const pkg = require('./package.json')

const libraryName = 'live-server'
const libVarName = camelCase(libraryName)
//const libClassName = `${libVarName[0].toUpperCase() + libVarName.slice(1)}` // PascalCase

// noinspection JSUnusedGlobalSymbols
export default {
	input: `src/main.ts`,
	output: {
		file: pkg.main,
		name: libVarName,
		format: 'umd',
		sourcemap: true,
		exports: 'named',
		banner: '#!/usr/bin/env node'
	},
	watch: {
		include: 'src/**',
	},
	plugins: [
		autoExternal(),
		typescript({
			useTsconfigDeclarationDir: true,
			cacheRoot: `${tempDir}/.rpt2_cache`, // See: https://github.com/ezolenko/rollup-plugin-typescript2/issues/34#issuecomment-332591290
		}),
		commonjs(),
		(process.env.BUILD === 'production' && terser()),
		sourceMaps(),
	],
}
