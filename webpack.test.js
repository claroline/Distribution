const paths = require('./main/core/Resources/webpack/paths')
const entries = require('./main/core/Resources/webpack/entries')
const shared = require('./main/core/Resources/webpack/shared')
const plugins = require('./main/core/Resources/webpack/plugins')
const loaders = require('./main/core/Resources/webpack/loaders')

module.exports = {
  entry: entries(),
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
  externals: {
    // https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md#react-15-compatibility)
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  }
}
