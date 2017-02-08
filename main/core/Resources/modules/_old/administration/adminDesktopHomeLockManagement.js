import $ from 'jquery'

/* global Routing */

$('#home-lock-table').on('click', '.lock-home-btn', function () {
  var currentBtn = $(this)
  var roleId = currentBtn.data('role-id')

  $.ajax({
    url: Routing.generate(
      'claro_admin_desktop_home_lock_change',
      {'role': roleId, 'locked': 1}
    ),
    type: 'POST',
    success: function () {
      currentBtn.removeClass('lock-home-btn')
      currentBtn.removeClass('fa-unlock')
      currentBtn.addClass('unlock-home-btn')
      currentBtn.addClass('fa-lock')
    }
  })
})

$('#home-lock-table').on('click', '.unlock-home-btn', function () {
  var currentBtn = $(this)
  var roleId = currentBtn.data('role-id')

  $.ajax({
    url: Routing.generate(
      'claro_admin_desktop_home_lock_change',
      {'role': roleId, 'locked': 0}
    ),
    type: 'POST',
    success: function () {
      currentBtn.removeClass('unlock-home-btn')
      currentBtn.removeClass('fa-lock')
      currentBtn.addClass('lock-home-btn')
      currentBtn.addClass('fa-unlock')
    }
  })
})
