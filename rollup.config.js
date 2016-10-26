import json from 'rollup-plugin-json'
var pkg = require('./package.json')

export default {
  entry: 'src/expanding.js',
  dest: 'dist/expanding.js',
  format: 'umd',
  moduleName: 'Expanding',
  plugins: [json({ include: ['./package.json'] })],
  banner: [
    '/*',
    ' * ' + pkg.name + ' ' + pkg.version,
    ' * Copyright © 2011+ ' + pkg.contributors[0].name,
    ' * Released under the ' + pkg.license + ' license',
    ' * ' + pkg.homepage,
    ' */',
    ''
  ].join('\n')
}
