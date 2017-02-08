import $ from 'jquery'
import modal from '#/main/core/_old/modal'

/* global Translator */
/* global Routing */

$('#types-management-body').on('click', '#create-type-btn', function () {
  modal.displayForm(
    Routing.generate('formalibre_admin_support_type_create_form'),
    reloadPage,
    function () {}
  )
})

$('#types-management-body').on('click', '.edit-type-btn', function () {
  var typeId = $(this).data('type-id')

  modal.displayForm(
    Routing.generate(
      'formalibre_admin_support_type_edit_form',
      {'type': typeId}
    ),
    reloadPage,
    function () {}
  )
})

$('#types-management-body').on('click', '.delete-type-btn', function () {
  var typeId = $(this).data('type-id')

  modal.confirmRequest(
    Routing.generate(
      'formalibre_admin_support_type_delete',
      {'type': typeId}
    ),
    reloadPage,
    typeId,
    Translator.trans('support_type_deletion_confirm_message', {}, 'support'),
    Translator.trans('support_type_deletion', {}, 'support')
  )
})

var reloadPage = function () {
  window.location.reload()
}
