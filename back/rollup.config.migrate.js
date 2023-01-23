import run from '@rollup/plugin-run';
import { external } from '@aminnairi/rollup-plugin-external';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/migrate.js',
    plugins: [
        external(),
        process.env.NODE_ENV === 'development' && run(),
        process.env.NODE_ENV === 'production' && terser(),
    ],
    output: {
        file: '../build/server/migrate.js',
        format: 'esm',
    },
};
