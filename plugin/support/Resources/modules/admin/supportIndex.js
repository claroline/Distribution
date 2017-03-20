import $ from 'jquery'

$('#ongoing-ticket-tab').on('click', '.delete-ticket-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.confirmRequest(
    Routing.generate('formalibre_admin_ticket_delete', {'ticket': ticketId}),
    removeTicketRow,
    ticketId,
    Translator.trans('ticket_deletion_confirm_message', {}, 'support'),
    Translator.trans('ticket_deletion', {}, 'support')
  )
})

$('#ongoing-ticket-tab').on('click', '.archive-ticket-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.confirmRequest(
    Routing.generate('formalibre_ticket_closing', {'ticket': ticketId}),
    closeTicket,
    ticketId,
    Translator.trans('ticket_closing_confirm_message', {}, 'support'),
    Translator.trans('ticket_closing', {}, 'support')
  )
})

  //$('#new-ticket-tab').on('click', '.change-ticket-type-btn', function () {
  //    var ticketId = $(this).data('ticket-id');
  //
  //    window.Claroline.Modal.displayForm(
  //        Routing.generate(
  //            'formalibre_admin_ticket_type_change_form',
  //            {'ticket': ticketId}
  //        ),
  //        refreshPage,
  //        function() {}
  //    );
  //});

  //$('#new-ticket-tab').on('click', '.view-comments-btn', function () {
  //    var ticketId = $(this).data('ticket-id');
  //
  //    window.Claroline.Modal.fromUrl(
  //        Routing.generate(
  //            'formalibre_admin_ticket_comments_view',
  //            {'ticket': ticketId}
  //        )
  //    );
  //});

const removeTicketRow = function (event, ticketId) {
  $(`#row-ticket-${ticketId}`).remove()
}

const closeTicket = function (event, ticketId) {
  const nbOngoing = parseInt($('#ongoing-tickets-tab-badge').html())
  const nbArchives = parseInt($('#archives-tab-badge').html())
  $('#ongoing-tickets-tab-badge').html(nbOngoing - 1)
  $('#archives-tab-badge').html(nbArchives + 1)
  $(`#row-ticket-${ticketId}`).remove()
}