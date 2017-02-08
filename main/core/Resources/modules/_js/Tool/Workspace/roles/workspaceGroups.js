import table from '#/main/core/_old/table'
import modal from '#/main/core/_old/modal'
import $ from 'jquery'

/* global Translator */

let parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.normal = {'route': 'claro_workspace_registered_group_list', 'parameters': {'workspace': window.workspaceId, 'order': window.order }}
parameters.route.search = {'route': 'claro_workspace_registered_group_list_search', 'parameters': {'workspace': window.workspaceId, 'order': window.order }}
table.initialize(parameters)

$('.popover-block').popover()
$('.remove-role-button').on('click', function (event) {
  var target = $(event.currentTarget)
  var route = target.attr('href')
  $.ajax({
    url: route,
    type: 'DELETE',
    success: function () {
      target.parent().parent().parent().remove()
    },
    error: function (jqXHR) {
      modal.hide()
      modal.simpleContainer(
        Translator.trans('error', {}, 'platform'),
        jqXHR.responseJSON.message
      )
    }
  })
})
