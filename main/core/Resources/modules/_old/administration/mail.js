import $ from 'jquery'

var formDisplay = {
  'sendmail': {
    'host': false,
    'username': false,
    'password': false,
    'auth_mode': false,
    'encryption': false,
    'port': false
  },
  'gmail': {
    'host': false,
    'username': true,
    'password': true,
    'auth_mode': false,
    'encryption': false,
    'port': false
  },
  'smtp': {
    'host': true,
    'username': true,
    'password': true,
    'auth_mode': true,
    'encryption': true,
    'port': true
  }
}

function display () {
  var transport = $('#platform_parameters_form_mailer_transport option:selected').val()
  var properties = formDisplay[transport]
  for (var item in properties) {
    var formElement = $('#platform_parameters_form_mailer_' + item)[0].parentElement.parentElement
    properties[item] ? $(formElement).show() : $(formElement).hide()
  }
}

display()

$('#platform_parameters_form_mailer_transport').change(function () {
  display()
})
