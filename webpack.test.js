const paths = require('./main/core/Resources/server/webpack/paths')
const entries = require('./main/core/Resources/server/webpack/entries')
const shared = require('./main/core/Resources/server/webpack/shared')
const plugins = require('./main/core/Resources/server/webpack/plugins')
const loaders = require('./main/core/Resources/server/webpack/loaders')

module.exports = {
  entry: entries.collectEntries(),
  output: {
    path: paths.output(),
    filename: '[name].js'
  },
  resolve: {
    root: paths.bower(),
    alias: shared.aliases()
  },
  plugins: [
    plugins.bowerFileLookup(),
    plugins.distributionShortcut(),
    plugins.configShortcut(),
    plugins.noCircularDependencies(),
    plugins.rethrowCompilationErrors()
  ],
  module: {
    loaders: [
      loaders.babel(true),
      loaders.rawHtml(),
      loaders.jqueryUiNoAmd(),
      loaders.css(),
      loaders.imageUris(),
      loaders.modernizr(),
      loaders.json()
    ]
  },
  externals: shared.externals()
}
