import $ from 'jquery'
import table from '#/main/core/_old/table'
import modal from '#/main/core/_old/modal'

/* global Routing */
/* global removeWorkspaceConfirm */

var parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.normal = {
  'route': 'claro_admin_workspaces_management',
  'parameters': {'order': window.order, 'type': window.type}
}
parameters.route.search = {
  'route': 'claro_admin_workspaces_management_search',
  'parameters': {'order': window.order, 'type': window.type}
}
parameters.route.action.remove = {
  'route': 'claro_admin_delete_workspaces',
  'parameters': {},
  'type': 'DELETE',
  'confirmTemplate': removeWorkspaceConfirm,
  'delete': true
}

$('#max-select').val(window.max)
$('#max-select').on('change', function () {
  $('#search-button').trigger('click')
})

table.initialize(parameters)

$('.visible').on('click', function (e) {
  e.preventDefault()
  var id = $(e.currentTarget).attr('id')
  var visible = $(e.currentTarget).attr('data-visible')
  var icon = e.target.parentElement.children

  $.ajax({
    'url': $('.visible').attr('href'),
    'type': 'POST',
    'data': {
      'id': id,
      'visible': visible
    },
    'success': function () {
      if (visible === '1') {
        $(icon[0]).removeClass('fa fa-eye')
        $(icon[0]).addClass('fa fa-eye-slash')
        $(e.currentTarget).attr('data-visible', '0')
      } else {
        $(icon[0]).removeClass('fa fa-eye-slash')
        $(icon[0]).addClass('fa fa-eye')
        $(e.currentTarget).attr('data-visible', '1')
      }
    }
  })
})

$('.registration').on('click', function (e) {
  e.preventDefault()
  var id = $(e.currentTarget).attr('id')
  var previousRegistrationStatus = $(e.currentTarget).attr('data-registration')
  var icon = e.target.parentElement.children

  $.ajax({
    'url': $('.registration').attr('href'),
    'type': 'POST',
    'data': {
      'id': id,
      'registration': previousRegistrationStatus
    },
    'success': function () {
      if (previousRegistrationStatus === 'unlock') {
        $(icon[0]).removeClass('fa fa-unlock')
        $(icon[0]).addClass('fa fa-lock')
        $(e.currentTarget).attr('data-registration', 'lock')
      } else {
        $(icon[0]).removeClass('fa fa-lock')
        $(icon[0]).addClass('fa fa-unlock')
        $(e.currentTarget).attr('data-registration', 'unlock')
      }
    }
  })
})

$('#type-select').on('change', function () {
  var url
  var workspaceType = $(this).val()

  if (window.search === '') {
    url = Routing.generate(
      'claro_admin_workspaces_management',
      {
        'max': window.max,
        'order': window.order,
        'direction': window.direction,
        'type': workspaceType
      }
    )
  } else {
    url = Routing.generate(
      'claro_admin_workspaces_management_search',
      {
        'search': window.search,
        'max': window.max,
        'order': window.order,
        'direction': window.direction,
        'type': workspaceType
      }
    )
  }

  window.location = url
})
$('#workspace-table-body').on('click', '.workspace-additional-action', function () {
  var child = $(this).children('.workspace-action')
  var url = child.data('url')
  var displayMode = child.data('display-mode')

  if (displayMode === 'modal_form') {
    modal.displayForm(
      url,
      function () {},
      function () {}
    )
  } else {
    window.location = url
  }
})
