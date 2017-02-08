import $ from 'jquery'

/* global Routing */

$('body').tooltip({
  selector: '[data-toggle=tooltip]'
})

$('.maintenance-popover').popover()

$('#hide-email-confirmation').on('click', function () {
  $.ajax({
    url: Routing.generate('claro_security_validate_email_hide'),
    type: 'GET',
    success: function () {
      $('.alert-email-confirm').hide()
    }
  })
})

$('#close-browser-warning').on('click', function () {
  window.sessionStorage.setItem('hide_brower_warning', true)
})

// The following code fixes the issue of unscrollable modal due to focus loss when multiple modals are opened.
var oldJqTrigger = $.fn.trigger
$.fn.trigger = function () {
  if (arguments && arguments.length > 0) {
    if (typeof arguments[0] === 'string') {
      if (arguments[0] === 'hidden.bs.modal') {
        if ($('.modal:visible').length) {
          $('.modal-backdrop').first().css('z-index', parseInt($('.modal:visible').last().css('z-index')) - 10)
          $('body').addClass('modal-open')
        }
      }
    }
  }
  return oldJqTrigger.apply(this, arguments)
}
