import 'mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker'
import $ from 'jquery'

$('body').on('focus', '.cursus_colorpicker', function () {
  $(this).colorpicker()
})
