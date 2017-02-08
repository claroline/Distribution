import $ from 'jquery'
import modal from '../modal'

/* global Routing */

$('#widgets-table').on('click', '.edit-widget-btn', function (e) {
  e.preventDefault()
  var widgetId = $(this).data('widget-id')

  modal.displayForm(
    Routing.generate('claro_widget_edit_form', {'widget': widgetId}),
    refreshPage,
    function () {}
  )
})

var refreshPage = function () {
  window.location.reload()
}
