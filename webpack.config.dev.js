// webpack.config.js
var Encore = require('@symfony/webpack-encore')

const entries = require('./webpack/entries')
const libraries = require('./webpack/libraries')
const webpack = require('webpack')
const plugins = require('./webpack/plugins')
const paths = require('./webpack/paths')
const shared = require('./webpack/shared')
const collectedEntries = entries.collectEntries()
const manifests = shared.dllManifests()

Encore
    .setOutputPath(paths.output())
    .setPublicPath('http://localhost:8080/dist')
    .autoProvidejQuery()
    .enableReactPreset()
    .setManifestKeyPrefix('/dist')
    .enableBuildNotifications()
    .enableSourceMaps(true)
    .addPlugin(plugins.distributionShortcut())
  //  .enablePostCssLoader()
/*
dll references are buggy atm
const references = plugins.dllReferences(manifests)
references.forEach(reference => Encore.addPlugin(reference))
*/
//allow url rewriting for '#/'
Encore.addLoader({test: /\.html$/, loader: 'html-loader'})

Object.keys(collectedEntries).forEach(key => Encore.addEntry(key, collectedEntries[key]))

config = Encore.getWebpackConfig()

console.error(config)

config.resolve.modules = ['./node_modules', './web/packages']
//in that order it solves some issues... if we start with bower.json, many packages don't work
config.resolve.descriptionFiles = ['package.json', '.bower.json', 'bower.json']
config.resolve.mainFields = ['main', 'browser']
config.resolve.aliasFields = ['browser']
config.resolve.alias = shared.aliases()
config.externals = shared.externals()

// export the final configuration
module.exports = config
