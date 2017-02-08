import clarolineTinymce from 'claroline/tinymce'
import $ from 'jquery'
var translator = window.Translator

$('body').bind('ajaxComplete', function() {
  clarolineTinymce.initialization()
})
  .on('click', '.mce-widget.mce-btn[aria-label="Fullscreen"]', function() {
    clarolineTinymce.toggleFullscreen(this)
    $(window).scrollTop($(this).parents('.mce-tinymce.mce-container.mce-panel').first().offset().top)
    window.dispatchEvent(new window.Event('resize'))
  })
  .bind('DOMSubtreeModified', function() {
    clearTimeout(clarolineTinymce.domChange)
    clarolineTinymce.domChange = setTimeout(clarolineTinymce.initialization, 10)
  })
  .on('click', 'form *[type=submit]', function() {
    clarolineTinymce.disableBeforeUnload = true
  })

$(document).ready(function() {
  clarolineTinymce.initialization()
})

$(window).on('beforeunload', function() {
  if (clarolineTinymce.checkBeforeUnload()) {
    return translator.trans('leave_this_page', {}, 'platform')
  }
})
