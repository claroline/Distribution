import $ from 'jquery'

window.unavailableRole.forEach(roleId => {
  $('#profile_form_platformRoles_' + roleId).attr('disabled', true)
})
