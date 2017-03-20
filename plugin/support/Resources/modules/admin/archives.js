import $ from 'jquery'

$('#archived-tickets-tab').on('click', '.delete-ticket-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.confirmRequest(
    Routing.generate('formalibre_admin_ticket_delete', {'ticket': ticketId}),
    removeTicketRow,
    ticketId,
    Translator.trans('ticket_deletion_confirm_message', {}, 'support'),
    Translator.trans('ticket_deletion', {}, 'support')
  )
})

$('#archived-tickets-tab').on('click', '.view-comments-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.fromUrl(
    Routing.generate('formalibre_admin_ticket_comments_view', {'ticket': ticketId})
  )
})

$('#archived-tickets-tab').on('click', '.view-interventions-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.fromUrl(
    Routing.generate('formalibre_admin_ticket_interventions_view', {'ticket': ticketId})
  )
})

const removeTicketRow = function (event, ticketId) {
  $(`#row-ticket-${ticketId}`).remove()
}