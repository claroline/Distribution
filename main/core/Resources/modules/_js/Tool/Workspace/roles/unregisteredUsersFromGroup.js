import $ from 'jquery'
import table from '#/main/core/_old/table'

/* global Translator */
/* global Routing */
/* global Twig */
/* global ModalWindow */
/* global ValidationFooter */

createValidationBox()

let parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.normal = {
  'route': 'claro_workspace_unregistered_users_from_group_list',
  'parameters': {
    'group': window.groupId,
    'workspace': window.workspaceId,
    'order': window.order
  }
}
parameters.route.search = {
  'route': 'claro_workspace_unregistered_users_from_group_list',
  'parameters': {
    'group': window.groupId,
    'workspace': window.workspaceId,
    'order': window.order
  }
}
table.initialize(parameters)

$('#add-role-button').on('click', function () {
  var msg = Translator.trans('add_role_to_users', {'count': $('.chk-user:checked').length}, {}, 'platform')

  $('#modal-explain').html(msg)
  $('#modal-roles').modal('show')
})

$('#add-modal-roles-btn').on('click', function () {
  var i = 0
  var queryString = {}
  var users = []
  $('.chk-user:checked').each(function (index, element) {
    users[i] = element.value
    i++
  })
  queryString.userIds = users

  i = 0
  var roles = []
  $('.chk-role:checked').each(function (index, element) {
    roles[i] = element.value
    i++
  })

  if (i < 1) {
    $('#table-modal').modal('hide')
    $('.modal-body').empty()

    return
  }

  queryString.roleIds = roles

  var route = Routing.generate('claro_workspace_add_roles_to_users', {'workspace': window.workspaceId })
  route += '?' + $.param(queryString)

  $.ajax({
    url: route,
    success: function () {
      var flashbag = $('#custom-flashbag-ul')
      flashbag.append('<li>' + Translator.trans('operation_done', {}, 'platform') + '</li>')
      $('#custom-flashbag-div').removeClass('hide')

      // add each role to the user list
      for (i = 0; i < users.length; i++) {
        var td = $('#row-' + users[i] + ' td:last-child')
        var cell = $(td[0])
        var html = cell.html()

        for (var j = 0; j < roles.length; j++) {
          var roleLib = $('#role-' + roles[j]).attr('data-name')
          // only append the span if the role isn't already here
          if (html.indexOf(roleLib) === -1) {
            html += '<span class=\'label label-success\'>' + roleLib + '</span>'
          }
        }

        cell.html(html)
      }
    }
  })

  $('#modal-roles').modal('hide')
})

function createValidationBox () {
  var html = Twig.render(
    ModalWindow,
    {'footer': Twig.render(ValidationFooter), 'isHidden': true, 'modalId': 'table-modal', 'body': ''}
  )
  $('body').append(html)
}

$('#flashbag-close-button').click(function () {
  $(this).parent().addClass('hide')
  $('#custom-flashbag-ul').empty()
})
