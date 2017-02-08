import $ from 'jquery'
import modal from '#/main/core/_old/modal'

/* global Translator */
/* global Routing */

$('#my-tickets-tab').on('click', '.delete-ticket-btn', function () {
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

$('#my-tickets-tab').on('click', '.view-comments-btn', function () {
  var ticketId = $(this).data('ticket-id')

  modal.fromUrl(
    Routing.generate(
      'formalibre_admin_ticket_comments_view',
      {'ticket': ticketId}
    )
  )
})

$('#my-tickets-tab').on('click', '.view-interventions-btn', function () {
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
