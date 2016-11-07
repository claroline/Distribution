const paths = require('../paths')
const entries = require('../entries')
const fs = require('fs')

// no implementation yet
function ConfigurationPlugin (options) {
  // Setup the plugin instance with options...
}

ConfigurationPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    console.log('Generating claroline configuration file...')
    const configurations = getConfigurations()
    compilation.assets['plugins-config.json'] = {
      source: function () {
        return JSON.stringify(configurations)
      },
      size: function () {
        return configurations.length
      }
    }

    callback()
  })
}

function getConfigurations () {
  const packages = entries.collectPackages(paths.root())
  const configs = {}

  packages.forEach(el => {
    if (entries.isMetaPackage(el.path)) {
      mergeObject(configs, getMetaEntries(el.path))
    } else {
      throw new Error('No implementation for client configuration file for the usual package.')
    }
  })

  return configs
}

function getMetaEntries (targetDir) {
  const configs = {}
  entries.getMetaBundles(targetDir).forEach(bundle => {
    try {
      data = JSON.parse(fs.readFileSync(`${bundle}/Resources/config/config.json`, 'utf8'))
      configs[entries.normalizeName(bundle.replace(paths.root() + '/vendor/', ''))] = data
    } catch(err) {}
  })

  return configs
}

function mergeObject(base, merged) {
    for (var attrname in merged) { base[attrname] = merged[attrname]; }
}

module.exports = ConfigurationPlugin
