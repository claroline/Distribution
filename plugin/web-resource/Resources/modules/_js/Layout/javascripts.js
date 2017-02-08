import $ from 'jquery'

//this is a weird little js

$(document).ready(function () {
  var $frame = $('iframe#web-resource-frame')

  // Resize IFrame on load
  $frame.load(function () {
    resizeIframe($(this))

    // Observe DOM modifications to resize IFrame to fit content
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

    const observer = new MutationObserver(function () {
      resizeIframe($frame)
    })

    observer.observe($frame.get(0).contentDocument.body, {
      subtree: true,
      childList: true
    })
  }).attr('src', '{{ absolutePath }}')

  // Resize IFrame on window resize
  $(window).on('resize', function () {
    resizeIframe($frame)
  })
})

function resizeIframe (frame) {
  var height = frame.contents().height()
  frame.animate({ height: height }, 100, function () {})
}
