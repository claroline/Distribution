/**
 * A LESS compiler plugin used to dump variables into a JSON.
 */

const getDumpVars = require('./dump-vars')

module.exports = {
  install: function(less, pluginManager) {
    const DumpVarsPlugin = getDumpVars(less)

    pluginManager.addVisitor(new DumpVarsPlugin())
  }
}
