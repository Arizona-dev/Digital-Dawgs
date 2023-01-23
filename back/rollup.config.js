import run from '@rollup/plugin-run';
import { external } from '@aminnairi/rollup-plugin-external';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';

export default {
    input: 'src/index.js',
    plugins: [
        babel({ babelHelpers: 'bundled' }),
        external(),
        process.env.NODE_ENV === 'development' && run(),
        process.env.NODE_ENV === 'production' && terser(),
    ],
    output: {
        file: '../build/server.js',
        format: 'esm',
    },
};
