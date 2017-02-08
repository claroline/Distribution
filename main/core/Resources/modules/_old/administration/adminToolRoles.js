import $ from 'jquery'

/* global Routing */

$('.chk-role').on('click', function (event) {
  var route
  var roleId = $(event.target).attr('data-role-id')
  var toolId = $(event.target).attr('data-tool-id')
  route = (!$(event.target).is(':checked')) ?
    'claro_admin_remove_tool_from_role' :
    'claro_admin_add_tool_to_role'
  var url = Routing.generate(route, {'role': roleId, 'tool': toolId})

  $.ajax({
    url: url,
    type: 'POST',
    success: function () {}
  })
})
