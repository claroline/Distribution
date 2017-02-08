import $ from 'jquery'

$('#recalculateAction').on('click', function () {
  var url = $(this).attr('href')
  var baseUrl = url.split('?')[0]
  // Always strip out query string params so they don't show twice in the URL in case of double click
  $(this).attr('href', baseUrl)

  // If checkebox is checked, add a query string param
  if ($('#recalculateAlreadyAwarded').is(':checked')) {
    $(this).attr('href', $(this).attr('href') + '?recalculateAlreadyAwarded=true')
  }
})
