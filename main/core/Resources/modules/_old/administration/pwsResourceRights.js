import $ from 'jquery'

/* global Routing */

$('.chk-rights').on('change', function () {
  var route = $(this).prop('checked') ?
    Routing.generate(
      'claro_admin_pws_activate_rights_change',
      {'role': $(this).attr('data-role-id')}
    ) :
    Routing.generate(
      'claro_admin_pws_deactivate_rights_change',
      {'role': $(this).attr('data-role-id')}
    )

  $.ajax({
    url: route,
    success: function () {}
  })
})
