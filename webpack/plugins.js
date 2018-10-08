/* global process */

const webpack = require('webpack')
const paths = require('./paths')

const AssetsPlugin = require('assets-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

/**
 * Adds a custom resolver that will try to convert internal webpack requests for
 * modules starting with "#/" (i.e by convention, modules located in the
 * distribution package) into requests with a resolved absolute path. Modules
 * are expected to live in the "Resources/modules" directory of each bundle,
 * so that part must be omitted from the import statement.
 *
 * Example:
 *
 * import baz from '#/main/core/foo/bar'
 *
 * will be resolved to:
 *
 * /path/to/vendor/claroline/distribution/main/core/Resources/modules/foo/bar
 */
const distributionShortcut = () => {
  return new webpack.NormalModuleReplacementPlugin(/^#\//, request => {
    const parts = request.request.substr(2).split('/')
    const resolved = [...parts.slice(0, 2), 'Resources/modules', ...parts.slice(2)]
    request.request = [paths.root(), 'vendor/claroline/distribution', ...resolved].join('/')
  })
}

/**
 * Bundles entries in separate DLLs to improve build performance.
 */
const dlls = () => {
  return new webpack.DllPlugin({
    path: `${paths.output()}/[name].manifest.json`,
    name: '[name]_[hash]'
  })
}

/**
 * Includes references to generated DLLs
 */
const dllReferences = manifests => {
  return manifests.map(manifest => new webpack.DllReferencePlugin({
    context: '.',
    manifest
  }))
}

const scaffoldingDllReference = () => {
  return new webpack.DllReferencePlugin({
    context: paths.output(),
    manifest: require(paths.output() + '/scaffolding_dll.manifest.json'),
    name: 'scaffolding_dll.js'
  })
}

const reactDllReference = () => {
  return new webpack.DllReferencePlugin({
    context: paths.output(),
    manifest: require(paths.output() + '/react_dll.manifest.json'),
    name: 'react_dll.js'
  })
}

/**
 * Makes the build crash in case of babel compilation errors. That
 * behaviour is pretty much needed when testing with karma.
 *
 * @see https://github.com/webpack/karma-webpack/issues/49
 */
const rethrowCompilationErrors = () => {
  return function () {
    this.plugin('done', stats => {
      if (stats.compilation.errors.length > 0) {
        if (stats.compilation.errors[0].name === 'ModuleBuildError') {
          // assume it's a babel syntax error and rethrow it
          throw stats.compilation.errors[0].error.error
        }

        throw new Error(stats.compilation.errors[0].message)
      }
    })
  }
}

/**
 * Builds a independent bundle for frequently requested modules (might require
 * minChunks adjustments).
 */
const commonsChunk = () => new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: 'commons.js',
  minChunks: 5
})

/**
 * Outputs information about generated assets in a dedicated file
 * ("webpack-assets.json" by default). This is useful to retrieve assets names
 * when a hash has been used for cache busting.
 */
const assetsInfoFile = filename => new AssetsPlugin({
  fullPath: false,
  prettyPrint: true,
  filename: filename || 'webpack-assets.json'
})

const circularDependencies = () => new CircularDependencyPlugin({
  // exclude detection of files based on a RegExp
  exclude: /node_modules/,
  failOnError: false,
  // allow import cycles that include an asynchronous import,
  // e.g. via import(/* webpackMode: "weak" */ './file.js')
  // (I don't know if we need it)
  allowAsyncCycles: false,
  // set the current working directory for displaying module paths
  cwd: process.cwd(),
})

module.exports = {
  distributionShortcut,
  dlls,
  commonsChunk,
  rethrowCompilationErrors,
  dllReferences,
  assetsInfoFile,
  reactDllReference,
  scaffoldingDllReference,
  circularDependencies
}
