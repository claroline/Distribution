import $ from 'jquery'

function showField (mode) {
  switch (mode) {
    case 0:
      $('#tags-field').hide('slow')
      $('#resources-field').show('slow')
      break
    case 1:
      $('#resources-field').hide('slow')
      $('#tags-field').show('slow')
      break
  }
}

$('#resources_widget_configuration_form_mode').on('change', function () {
  var modeValue = parseInt($(this).val())
  showField(modeValue)
})

var value = parseInt($('#resources_widget_configuration_form_mode').val())
showField(value)
