/**
 * Get the path to an asset file in the web directory.
 *
 * @param {string} assetName - the name of the asset
 *
 * @returns {string}
 */
export function asset(assetName) {
  console.log(document)
  console.log(document.getElementById('#baseAsset'))

  const element = document.getElementById('#baseAsset')

  let basePath = ''
  if (element) {
    basePath = element.html()
  }

  return basePath + assetName
}
