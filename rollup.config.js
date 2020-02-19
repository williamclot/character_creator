import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve';
import images from 'rollup-plugin-image-files'
import autoExternal from 'rollup-plugin-auto-external'
import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript';


import pkg from './package.json'

export default {
	input: 'src/App.js',
	plugins: [
		autoExternal(),
		resolve(),

		postcss({
			extract: true,
			// modules: true,
			autoModules: true
		}),

		images(),
		typescript({
			exclude: 'node_modules/**'
		}),
		babel({
			exclude: 'node_modules/**'
		}),
	],
	output: [
		/*
			Currently, the target environment knows how to handle es,
			so until another target is needed, es will be the only output
		*/
		{
			file: pkg.module,
			format: 'es'
		},

	]
};