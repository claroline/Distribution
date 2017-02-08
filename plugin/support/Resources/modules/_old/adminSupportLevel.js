import $ from 'jquery'
import modal from '#/main/core/_old/modal'

/* global Translator */
/* global Routing */

$('#level-ticket-tab').on('click', '.delete-ticket-btn', function () {
  var ticketId = $(this).data('ticket-id')

  modal.confirmRequest(
    Routing.generate(
      'formalibre_admin_ticket_delete',
      {'ticket': ticketId}
    ),
    removeTicketRow,
    ticketId,
    Translator.trans('ticket_deletion_confirm_message', {}, 'support'),
    Translator.trans('ticket_deletion', {}, 'support')
  )
})

$('#level-ticket-tab').on('click', '.change-ticket-type-btn', function () {
  var ticketId = $(this).data('ticket-id')

  modal.displayForm(
    Routing.generate(
      'formalibre_admin_ticket_type_change_form',
      {'ticket': ticketId}
    ),
    refreshPage,
    function () {}
  )
})

$('#level-ticket-tab').on('click', '.view-comments-btn', function () {
  var ticketId = $(this).data('ticket-id')

  modal.fromUrl(
    Routing.generate(
      'formalibre_admin_ticket_comments_view',
      {'ticket': ticketId}
    )
  )
})

$('#level-ticket-tab').on('click', '.view-interventions-btn', function () {
  var ticketId = $(this).data('ticket-id')

  modal.fromUrl(
    Routing.generate(
      'formalibre_admin_ticket_interventions_view',
      {'ticket': ticketId}
    )
  )
})

var removeTicketRow = function (event, ticketId) {
  $('#row-ticket-' + ticketId).remove()
}

var refreshPage = function () {
  window.location.reload()
}
