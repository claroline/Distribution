import $ from 'jquery'

var intervalFunction

var postHeight = function postHeight (height) {
  if (parent) {
    var screenHeight = screen.height
    var newHeight = height || document.body.scrollHeight

    if (newHeight > screenHeight) {
      return
    }
    var message = 'documentHeight:' + newHeight
    parent.postMessage(message, '*')
  }
}

$(document).ready(function () {
  postHeight()
  /* Hack for constantly polling iframe inner height and react when angular router loads another page */
  var getIframeWindowHeight = function () {
    return $('iframe#embeddedActivity').contents().find('body').first().height()
  }
  var oldHeight = getIframeWindowHeight()
  intervalFunction = setInterval(function () {
    var newHeight = getIframeWindowHeight()

    if (newHeight === null) {
      clearInterval(intervalFunction)
    } else if (newHeight !== oldHeight) {
      postHeight(newHeight)
      oldHeight = newHeight
    }
  }, 2000)
  /* End of Hack */

})
