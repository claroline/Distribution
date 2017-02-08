const fs = require('fs')

function ExtractExternalsPlugin() {}

ExtractExternalsPlugin.prototype.apply = function (compiler) {
  var externals = []

  for (var identifier in compiler.options.externals) {
    externals.push(identifier)
  }

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin(['optimize-chunks', 'optimize-extracted-chunks'], function (chunks) {
      if (externals.length === 0) {
        return
      }

      const chunksExternals = {}

      chunks.forEach(chunk => {
        chunksExternals[chunk.name] = []
        chunk.modules.forEach(module => {
          findExternals(externals, module).forEach(external => {
            if (chunksExternals[chunk.name].indexOf(external) === -1) {
              chunksExternals[chunk.name].push(external)
            }
          })
        })
      })

      fs.writeFileSync('webpack-externals.json', JSON.stringify(chunksExternals, null, 2))
    })
  })
}

function findExternals(definedExternals, module, foundExternals, dependencies) {
  foundExternals = foundExternals || []
  dependencies = dependencies || []

  if (module) {
    module.dependencies.forEach(dependency => {
      if (dependency.module && dependencies.indexOf(dependency.module) === -1) {
        dependencies.push(dependency.module)

        if (definedExternals.indexOf(dependency.request) !== -1) {
          if (foundExternals.indexOf(dependency.request) === -1) {
            foundExternals.push(dependency.request)
          } else console.log(dependency.request, 'already in')
        }

        findExternals(definedExternals, dependency.module, foundExternals, dependencies)
      }
    })
  }

  return foundExternals
}

module.exports = ExtractExternalsPlugin
