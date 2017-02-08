import UserPicker from '#/main/core/_old/user/userPicker'
import $ from 'jquery'

/* global Routing */

$('body').on('click', '.user-picker-' + window.timedPickerName, function () {
  var inputValue = $('#user-picker-input-' + window.timedPickerName).val()
  var ids = inputValue.split(',')
  var selectedUserIds = window.selectedUserIds

  if (ids.length > 0 && ids[0] !== '') {
    selectedUserIds = []

    for (var i = 0; i < ids.length; i++) {
      var id = parseInt(ids[i])

      if (selectedUserIds.indexOf(id) === -1) {
        selectedUserIds.push(id)
      }
    }
  }

  var userPicker = new UserPicker()
  var settings = window.settings
  settings.selected_users = selectedUserIds,

  userPicker.configure(settings, null)
  userPicker.open()
})

var input = $('#user-picker-input-view-' + window.timedPickerName)
input.each(function () {
  var element = $(this)
  var value = '' + element.data('value')
  var multiple = element.data('multiple')
  var status = element.data('status')

  if (status === 'id') {
    if (multiple === 'single') {
      $.ajax({
        url: Routing.generate(
          'claro_user_infos_request',
          {'user': parseInt(value)}
        ),
        type: 'GET',
        success: function (datas) {
          var name = datas['firstName'] + ' ' + datas['lastName']
          element.val(name)
        }
      })
    } else if (multiple === 'multiple') {
      var ids = value.split(',')

      if (ids.length > 0 && ids[0] !== '') {
        var userIds = []

        for (var i = 0; i < ids.length; i++) {
          userIds.push(parseInt(ids[i]))
        }
        var route = Routing.generate('claro_users_infos_request')
        var parameters = {}
        parameters.userIds = userIds
        route += '?' + $.param(parameters)

        $.ajax({
          url: route,
          type: 'GET',
          success: function (datas) {
            var names = ''

            for (var j = 0; j < datas.length; j++) {
              names += datas[j]['firstName'] + ' ' + datas[j]['lastName']

              if (j < datas.length - 1) {
                names += ','
              }
            }
            element.val(names)
          }
        })
      }
    }
  }
})
