import $ from 'jquery'

function checkDesktop () {
  var value = $('#widget_form_isDisplayableInDesktop').prop('checked')

  if (value) {
    $('#roles-form-field').removeClass('hidden')
    $('#roles-form-field').show('slow')
  } else {
    $('#roles-form-field').hide('slow')
  }
}

$('#widget-edit-form').on('change', '#widget_form_isDisplayableInDesktop', function () {
  checkDesktop()
})

checkDesktop()
