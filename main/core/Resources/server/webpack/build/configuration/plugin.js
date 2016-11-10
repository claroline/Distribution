const paths = require('../../paths')
const entries = require('../../entries')
const fs = require('fs')
const validator = require('./validator')

// no implementation yet
function ConfigurationPlugin(options) {
  // Setup the plugin instance with options...
}

//global because I'm lazy atm
var first = true

ConfigurationPlugin.prototype.apply = function(compiler) {
  var generated = false
  compiler.plugin('compile', function(compilation) {
    if (!generated) {
      console.log('\nGenerating claroline configuration file...')
      str = 'module.exports = {\n'
      str = writeLn(str, getConfigurations())
      str = writeLn(str, '}\n')

      fs.writeFileSync(paths.root() + '/web/dist/plugins-config.js', str)
      generated = true
    }
  })
}

function getConfigurations() {
  const packages = entries.collectPackages(paths.root())
  var str = ''

  packages.forEach(el => {
    if (entries.isMetaPackage(el.path)) {
      str += getMetaEntries(el.path)
    } else {
      throw new Error('No implementation for client configuration file for the usual package.')
    }
  })

  return str
}

function getMetaEntries(targetDir) {
  var str = ''

  entries.getMetaBundles(targetDir).forEach(bundle => {
    var configFile = `${bundle}/Resources/config/config.js`
    if (fs.existsSync(configFile)) {
      var plugin = require(configFile)
      validator.validate(plugin)
      var mod = bundle.split('/').pop()
      if (!first) {
        str = writeLn(str, ',')
      }
      str = writeLn(str, `    ${mod}: require('${configFile}')`)
      first = false
    }
  })

  return str
}

function writeLn(str, line) {
  return str += line + '\n'
}

module.exports = ConfigurationPlugin
