import $ from 'jquery'
import 'bootstrap-datepicker'

$(document).ready(function () {
  $(`#${window.formId}`).datepicker(window.options)
})
