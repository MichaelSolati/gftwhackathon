import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import license from 'rollup-plugin-license';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import path from 'path';

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

let plugins = [
  scss({output: false}),
  resolve(),
  typescript({
    tsconfig: 'tsconfig.json',
  }),
  commonjs(),
];

if (process.env.ROLLUP_WATCH) {
  plugins = [
    ...plugins,
    serve({
      contentBase: 'public',
      host: 'localhost',
      port: 3000,
      verbose: true,
    }),
    livereload(),
  ];
} else {
  plugins = [
    ...plugins,
    cleanup({comments: 'none'}),
    terser(),
    license({
      thirdParty: {
        includePrivate: true,
        output: {
          file: path.join(__dirname, 'public', 'dependencies.txt'),
          encoding: 'utf-8',
        },
      },
    }),
  ];
}

export default {
  input: 'src/index.ts',
  output: {
    file: 'public/index.js',
    format: 'umd',
    name: 'window',
    extend: true,
  },
  plugins,
  onwarn,
};
