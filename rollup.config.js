import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import images from 'rollup-plugin-image-files';
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';

export default {
	input: 'src/index.js',
	plugins: [
		autoExternal(),
		resolve(),

		postcss({
			extract: true,
			// modules: true,
			autoModules: true
		}),

		images(),

		babel({
			exclude: 'node_modules/**'
		}),
	],
	output: {
		format: 'es',
		file: 'dist/es-module.js',
	}
};