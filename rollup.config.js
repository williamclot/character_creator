import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import images from '@rollup/plugin-image';
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';

const extensionsToProcess = ['.js', '.ts', '.tsx'];

export default {
    input: 'src/index.js',

    plugins: [
        autoExternal(),
        resolve({
            extensions: extensionsToProcess,
        }),

        postcss({
            extract: true,
            // modules: true,
            autoModules: true,
        }),

        images(),
        babel({
            extensions: extensionsToProcess,
            exclude: 'node_modules/**',
        }),
    ],
    output: [
        /*
			Currently, the target environment knows how to handle es,
			so until another target is needed, es will be the only output
		*/
        {
            file: pkg.module,
            format: 'es',
        },
    ],
};
