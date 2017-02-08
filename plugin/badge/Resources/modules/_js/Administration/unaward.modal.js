import $ from 'jquery'

var $form = $('form#badge-edit')
var url = $form.attr('action')
var baseUrl = url.split('?')[0]

$('#unawardAction').on('click', function (event) {
  event.preventDefault()

  // Always strip out query string params so they don't show twice in the URL in case of double click
  $form.attr('action', baseUrl)

  // If checkbox is checked, add a query string param
  if ($('#unawardAlreadyAwarded').is(':checked')) {
    $form.attr('action', $form.attr('action') + '?unawardBadge=true')
  }

  // Add hash
  $form.attr('action', $form.attr('action') + '#!edit')

  $form.submit()
})
