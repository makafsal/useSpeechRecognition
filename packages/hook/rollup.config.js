import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts', // Entry point of your hook
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs', // CommonJS for Node.js
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm', // ES Module for modern bundlers
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(), // Exclude peer dependencies (e.g., React)
    resolve(), // Resolves node_modules imports
    commonjs(), // Converts CommonJS modules to ES6
    typescript({ tsconfig: './tsconfig.json' }), // Compiles TypeScript
    terser() // Minifies output
  ],
  external: ['react', 'react-dom'] // Prevent bundling React
};
