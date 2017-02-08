import $ from 'jquery'
import 'bootstrap-datepicker'

function enableNotification () {
  var value = $('#announcement_form_visible_from').val()

  if (value === '') {
    $('#announcement_form_notify_user').prop('disabled', false)
  } else {
    $('#announcement_form_notify_user').prop('checked', false)
    $('#announcement_form_notify_user').prop('disabled', 'disabled')
  }
}

$('.datepicker').on('click', function (event) {
  $(event.currentTarget).datepicker('show')
})

$('.visible-chk').on('click', function () {
  var isChecked = $('.visible-chk').attr('checked')
  if (isChecked === 'checked') {
    $('.datepicker').each(function () {
      $(this).prop('disabled', false)
    })
  } else {
    $('.datepicker').each(function () {
      $(this).attr('disabled', 'disabled')
    })
  }
})

$('#announcement_form_visible_from').on('change', function () {
  enableNotification()
})

enableNotification()
