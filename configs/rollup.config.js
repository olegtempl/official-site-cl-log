import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
const path = require('./path.json');

export default {
  input: 'src/js/index.js',
  output: {
    file: 'build/js/index.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};