/**
 * http://stackoverflow.com/questions/5643635/how-to-get-selected-html-text-with-javascript
 *
 * @param  {Element} el
 * @param  {Object} range selection range
 */

export default function select(el, sel)
{
  //get the word
  const word = sel.toString()
  //get the range
  let ran = sel.getRangeAt(0)
  //don't do stupid things with the current range
  ran = ran.cloneRange()
  //range now start with the beginning of the containing div otherwise we're going to start after the end of the latest
  //closed HTML Element. This is not what we want.
  ran.setStart(el, 0)
  //get an Document Fragment
  const before = ran.cloneContents()
  //make it usable
  const tmp = document.createElement('div')
  tmp.appendChild(before)
  let innerHTML = tmp.innerHTML
  //we need to remove the closing tag because it's added automatically and we don't want it
  const regex = new RegExp('(<\/[^<>]*>$)', 'gi')
  innerHTML= innerHTML.replace(regex, '')

  const rect = ran.getBoundingClientRect()

  //fuck this shit, now it's over !
  const positions = {
    word,
    start: innerHTML.length - word.length,
    end: innerHTML.length,
    offsetY: (rect.bottom + rect.top) / 2 + window.pageYOffset,
    offsetX: rect.right
  }

  return positions
}
