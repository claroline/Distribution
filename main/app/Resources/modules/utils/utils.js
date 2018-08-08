function mediaSrcExtractor(tag, srcContent, srcs) {
  const mainSource = !srcContent ? '' : `src="${srcContent}"`
  let ret = `[${tag} ${mainSource}`

  if (srcs) {
    const sources = srcs.match(/src=[\'"]([^\'"]+)[\'"]/g)
    sources.forEach(source => ret += ` src="${source}"`)
  }
  ret += ']'

  return ret
}

/**
 * Strips tags in given html.
 *
 * @param {string}  html
 * @param {boolean} preserveMedia
 */
function stripTagsFromHtml(html, preserveMedia = false) {
  let processedHtml = html

  if (preserveMedia) {
    processedHtml = processedHtml.replace(
      /<(img|embed)([^>]+src=[\'"]([^\'"]+)[\'"])*[^\/>]*\/?>/i,
      '[$1 src="$3"]'
    )
    processedHtml = processedHtml.replace(
      /<(video|audio)([^>]+src=[\'"]([^\'"]+)[\'"])*[^\/>]*\/?>([\s\S]*)<\/\1>/i,
      (matches, tag, src, srcContent, srcs) => mediaSrcExtractor(tag, srcContent, srcs)
    )
  }
  let element = document.createElement('div');
  element.innerHTML = processedHtml;

  return element.textContent
}

export {
  stripTagsFromHtml
}
