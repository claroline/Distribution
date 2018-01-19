// webpack.config.js
var Encore = require('@symfony/webpack-encore')

const libraries = require('./webpack/libraries')
const webpack = require('webpack')
const plugins = require('./webpack/plugins')

Encore
  .setOutputPath('web/dist')
  .setPublicPath('/dist')
  .cleanupOutputBeforeBuild()
  .enableBuildNotifications()
  //.enableVersioning()
  .enableSourceMaps(false)
  .configureManifestPlugin(options => options.fileName = 'manifest.dll.json')
  .addPlugin(plugins.dlls())
  .addPlugin(plugins.assetsInfoFile('webpack-dlls.json'))

Object.keys(libraries).forEach(key => Encore.addEntry(key, libraries[key]))

config = Encore.getWebpackConfig()

config.resolve.modules = ['./node_modules', './web/packages']
//in that order it solves some issues... if we start with bower.json, many packages don't work
config.resolve.descriptionFiles = ['package.json', '.bower.json', 'bower.json']
config.resolve.mainFields = ['main', 'browser']
config.resolve.aliasFields = ['browser']

// export the final configuration
module.exports = config
