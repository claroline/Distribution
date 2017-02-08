import 'mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker'
import $ from 'jquery'

$(document).ready(function () {
  document.getElementById('form_name2').defaultValue = window.name
})

$(document).ready(function () {
  document.getElementById('form_color2').defaultValue = window.color
})
$(document).ready(function () {
  var byDefault = window.byDefault
  if (byDefault) {
    document.getElementById('form_principalStatus2').checked = true
  }
})

$(function () {
  $('#form_color2').colorpicker()
})
