const fs = require('fs')
const path = require('path')
const paths = require('../../paths')

const VARS_FILE = path.resolve(paths.root(), 'variables.json')

module.exports = function (less) {
  function DumpVarsPlugin() {
    this._visitor = new less.visitors.Visitor(this)
  }

  DumpVarsPlugin.prototype = {
    isReplacing: false,
    //isPreVisitor: true,
    run: (root) => {
      this.vars = {}

      const variables = root.variables()

      /*const evalEnv = {}
      evalEnv.frames = [
        new less.tree.Ruleset(null, variables)
      ]*/

      /*console.log(Object.keys(less.data))*/

      for (let variableName in variables) {
        if (variables.hasOwnProperty(variableName)) {
          let variable = variables[variableName]
          this.vars[variableName] = variable.value.toCSS(root)
        }
      }

      /*console.log(this.vars)*/


      fs.writeFileSync(VARS_FILE, JSON.stringify(this.vars, null, 2))

      /*this._visitor.visit(root)*/
    },

    visitVariable: (node) => {
      console.log(node)
    }
  }

  return DumpVarsPlugin
}
