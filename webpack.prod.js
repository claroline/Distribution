const paths = require('./main/core/Resources/server/webpack/paths')
const entries = require('./main/core/Resources/server/webpack/entries')
const shared = require('./main/core/Resources/server/webpack/shared')
const plugins = require('./main/core/Resources/server/webpack/plugins')
const loaders = require('./main/core/Resources/server/webpack/loaders')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production')
}

module.exports = {
  entry: entries.collectEntries('entry'),
  output: {
    path: paths.output(),
    filename: '[name]-[hash].js'
  },
  resolve: {
    root: paths.bower(),
    alias: shared.aliases()
  },
  plugins: [
    plugins.assetsInfoFile(),
    plugins.bowerFileLookup(),
    plugins.distributionShortcut(),
    plugins.defineProdEnv(),
    plugins.extractExternals(),
    //plugins.dedupeModules(),
    plugins.rejectBuildErrors(),
    plugins.exitWithErrorCode(),
    plugins.clarolineConfiguration(),
    plugins.configShortcut(),
    plugins.occurrenceOrder()
  ],
  module: {
    loaders: [
      loaders.babel(),
      loaders.font(),
      loaders.rawHtml(),
      loaders.jqueryUiNoAmd(),
      loaders.fullcalendarNoAmd(),
      loaders.css(),
      loaders.imageUris(),
      loaders.modernizr(),
      loaders.tinymceImport(),
      loaders.tinymceWrapper(),
      loaders.tinymceJquery(),
      loaders.angularImport(),
      loaders.json()
    ]
  },
  externals: shared.externals(),
  devtool: false
}
