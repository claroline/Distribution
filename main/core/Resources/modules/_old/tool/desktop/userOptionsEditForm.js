import $ from 'jquery'
import 'mjolnic-bootstrap-colorpicker'

$('body').on('focus', '#user_options_form_desktopBackgroundColor', function () {
  $(this).colorpicker()
})

$('#user_options_form_desktopBackgroundColor').colorpicker().on('changeColor', function (ev) {
  $('body').css('background-color', ev.color.toHex())
})
