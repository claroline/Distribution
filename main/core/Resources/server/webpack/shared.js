const path = require('path')
const paths = require('./paths')
const libraries = require('./libraries')

const externals = () => ({
  'jquery': 'jQuery',
  // https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md#react-15-compatibility)
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true
})

const aliases = () => ({
  modernizr$: path.resolve(paths.distribution(), '.modernizrrc')
})

const dllManifests = () => {
  return Object.keys(libraries).map(name => {
    return require(`${paths.output()}/${name}.manifest.json`)
  })
}

module.exports = {
  externals,
  aliases,
  dllManifests
}
