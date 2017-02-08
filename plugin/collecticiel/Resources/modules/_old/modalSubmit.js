import $ from 'jquery'

$(document).ready(function () {
  $('.form-buttons').hide()

  $('#form-submit').on('click', function () {
    // I do the "click" on submit button for keep html5 warning
    $('.modal-body button[type="submit"]').trigger('click')
  })
})
