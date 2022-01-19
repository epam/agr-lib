import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import * as path from 'path';
import pkg from './package.json';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: pkg.source,
    output: [
      {
        format: 'umd',
        file: pkg.browser,
        name: 'agr-engine',
        sourcemap: true,
      },
      {
        format: 'umd',
        file: pkg.browserMin,
        name: 'agr-engine',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        format: 'es',
        file: pkg.module,
        sourcemap: true,
      },
      {
        format: 'es',
        file: pkg.moduleMin,
        sourcemap: true,
        plugins: [terser()],
      },
      {
        format: 'cjs',
        file: pkg.main,
        sourcemap: true,
      },
      {
        format: 'cjs',
        file: pkg.mainMin,
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'bundled',
        configFile: path.resolve(__dirname, 'babel.config.js'),
      }),
    ],
    external: [...Object.keys(pkg.peerDependencies || {})],
  },
  //Bundle types definition into single file
  {
    input: 'dist/lib/index.d.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
];
