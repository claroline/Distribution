import $ from 'jquery'
import modal from '#/main/core/_old/modal'

/* global Translator */
/* global Routing */

$('#interventions-box').on('click', '.delete-intervention-btn', function () {
  var interventionId = $(this).data('intervention-id')

  modal.confirmRequest(
    Routing.generate(
      'formalibre_admin_ticket_intervention_delete',
      {'intervention': interventionId}
    ),
    reloadPage,
    interventionId,
    Translator.trans('intervention_deletion_confirm_message', {}, 'support'),
    Translator.trans('intervention_deletion', {}, 'support')
  )
})

var reloadPage = function () {
  window.location.reload()
}
