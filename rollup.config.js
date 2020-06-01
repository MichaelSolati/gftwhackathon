import commonjs from 'rollup-plugin-commonjs';
import resolveModule from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

export default {
  input: 'src/index.ts',
  output: {
    file: 'public/index.js',
    format: 'umd',
    name: 'window',
    extend: true,
  },
  plugins: [
    resolveModule(),
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
        },
      },
    }),
    commonjs(),
    terser(),
    serve({
      contentBase: 'public',
      host: 'localhost',
      port: 3000,
      verbose: true,
    }),
    livereload()
  ],
  onwarn,
};
