import table from '#/main/core/_old/table'
import $ from 'jquery'

/* global restoreMessageConfirm */
/* global removeMessageConfirm */

let parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.normal = {'route': 'claro_message_list_removed', 'parameters': {}}
parameters.route.search = {'route': 'claro_message_list_removed_search', 'parameters': {}}
parameters.route.action.remove = {'route': 'claro_message_delete', 'parameters': {}, 'btn': 'action-delete-button', 'type': 'DELETE', 'confirmTemplate': removeMessageConfirm, 'delete': true}
parameters.route.action.restore = {'route': 'claro_message_restore_from_trash', 'parameters': {}, 'btn': 'action-restore-button', 'confirmTemplate': restoreMessageConfirm, 'delete': true}
table.initialize(parameters)

$('tr.pointer-hand').on('click', function () {
  var targetClass = event.target.className
  if (targetClass !== 'chk-item' && targetClass !== 'fa fa-envelope') {
    window.document.location = $(this).attr('data-route')
  }
})

$('.mark-as-read').on('click', function (e) {
  e.preventDefault()
  $.ajax({
    type: 'GET',
    url: $(e.currentTarget).attr('href'),
    success: function () {
      $(e.target).css('color', 'green')
      $(e.target).attr('class', 'fa fa-check-circle')
      var row = $(e.target)[0].parentElement.parentElement.parentElement
      $(row).addClass('active')
    }
  })
})
