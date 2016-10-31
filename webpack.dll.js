const paths = require('./main/core/Resources/webpack/paths')
const plugins = require('./main/core/Resources/webpack/plugins')
const libraries = require('./main/core/Resources/webpack/libraries')

module.exports = {
  entry: libraries,
  output: {
    path: paths.output(),
    filename: '[name].dll.js',
    library: '[name]_dll_[hash]'
  },
  resolve: {
    root: paths.bower()
  },
  plugins: [
    plugins.bowerFileLookup(),
    plugins.dlls()
  ],
  devtool: false
}
