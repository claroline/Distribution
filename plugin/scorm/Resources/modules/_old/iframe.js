window.Claroline = window.Claroline || {}

var iframe = window.Claroline.Iframe = {}

iframe.resize = function (frameId) {
  var height = window.innerWidth // Firefox
  if (document.body.clientHeight)	height = document.body.clientHeight // IE

  var frame = document.getElementById(frameId)
  frame.style.height = parseInt(height - frame.offsetTop - 8) + 'px'
}

export default iframe
