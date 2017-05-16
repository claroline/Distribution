export const execute = file => {
  // get some kind of XMLHttpRequest
  var xhrObj = new XMLHttpRequest()
  // open and send a synchronous request
  xhrObj.open('GET', file, false)
  xhrObj.send('')

  eval(xhrObj.responseText)
}
