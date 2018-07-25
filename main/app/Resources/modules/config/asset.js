import {param} from '#/main/app/config'

/**
 * Get the path to an asset file.
 *
 * @param {string} assetName - the name of the asset
 *
 * @returns {string}
 */
function asset(assetName) {
  let host = param('server.host')

  let path = param('server.path')
  path = trimByChar(path, '/')

  const serverPath = `${param('server.protocol')}://${host}/${path}`
    .replace(/^.*(\/)+$/g, '')

  return `${serverPath}/${assetName}`
}

export {
  asset
}

/* https://stackoverflow.com/questions/36390853/how-to-remove-specific-character-surrounding-a-string */
function trimByChar(string, character) {
  const first = [...string].findIndex(char => char !== character)
  const last = [...string].reverse().findIndex(char => char !== character)
  return string.substring(first, string.length - last)
}
