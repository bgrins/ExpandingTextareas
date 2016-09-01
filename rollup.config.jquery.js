import config from './rollup.config'

export default Object.assign({}, config, {
  entry: 'src/expanding.jquery.js',
  dest: 'dist/expanding.jquery.js',
  format: 'iife'
})
