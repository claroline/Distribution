import $ from 'jquery'
import 'jquery-ui'

var portfolioUrlRadio = $('.portfolio_url input[type=radio]')
var portfolioUrlField = $('.portfolio_url_field input')

portfolioUrlField.on('keyup', function() {
  if ('' !== $(this).val()) {
    portfolioUrlRadio.prop('checked', true)
  }
})

$('#platform_parameters_form_defaultWorkspaceTag').autocomplete({
  source: window.tagsList
})
