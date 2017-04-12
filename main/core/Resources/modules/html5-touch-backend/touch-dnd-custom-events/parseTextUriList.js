// Return an array of URL strings.
export default function parseTextUriList(textUriList) {
  // Lines are terminated with a CRLF pair.
  textUriList = textUriList.replace(/(?:\r\n|\r|\n)$/, '')
  if (textUriList === '') { return [] }

  return textUriList.split(/(?:\r\n|\r|\n)/).filter(function (line) {
    // Ignore comments.
    return line[0] !== '#'
    // The remaining non-comment lines will be URIs (URNs or URLs),
    // encoded according to the URL or URN specifications (RFC2141,
    // RFC1738 and RFC2396). Each URI shall appear on one and only one
    // line. Very long URIs are not broken in the text/uri-list format.
    // Content-transfer-encodings may be used to enforce line length
    // limitations.
  })
}
