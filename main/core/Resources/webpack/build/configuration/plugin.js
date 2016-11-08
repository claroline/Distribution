const paths = require('../../paths')
const entries = require('../../entries')
const fs = require('fs')

// no implementation yet
function ConfigurationPlugin (options) {
  // Setup the plugin instance with options...
}

ConfigurationPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation, callback) {

    console.error('Generating claroline configuration file...')
    var str = getConfigurations()
    str = `var config = {}\n` + str
    str = writeLn(str, `export default config`)
    compilation.assets['plugins-config.js'] = {
      source: function () {
        return str
      },
      size: function () {
        return str.length
      }
    }

    //callback()
  })
}

function getConfigurations () {
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

function getMetaEntries (targetDir) {
  var str = ''

  entries.getMetaBundles(targetDir).forEach(bundle => {
      var configFile = `${bundle}/Resources/config/config.js`
      if (fs.existsSync(configFile)) {
          var mod = bundle.split('/').pop()
          //str = writeLn(str, 'var cursus')
          str = writeLn(str, `import ${mod} from '${configFile}'`)
          str = writeLn(str, `config.${mod} = ${mod}`)
      }
  })

  return str
}

function writeLn(str, line) {
    return str += line + `\n`
}

module.exports = ConfigurationPlugin
