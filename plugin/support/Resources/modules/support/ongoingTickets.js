import $ from 'jquery'

$('#ongoing-tickets-tab').on('click', '#create-ticket-btn', function () {
  window.Claroline.Modal.displayForm(
    Routing.generate('formalibre_ticket_create_form'),
    addTicket,
    function() {}
  )
})

$('#ongoing-tickets-tab').on('click', '.edit-ticket-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.displayForm(
    Routing.generate('formalibre_ticket_edit_form', {ticket: ticketId}),
    updateTicket,
    function() {}
  )
})

$('#ongoing-tickets-tab').on('click', '.delete-ticket-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.confirmRequest(
    Routing.generate('formalibre_ticket_hard_delete', {ticket: ticketId}),
    removeTicket,
    ticketId,
    Translator.trans('ticket_deletion_confirm_message', {}, 'support'),
    Translator.trans('ticket_deletion', {}, 'support')
  )
})

const addTicket = function (data) {
  const ticket = `
    <tr id="row-ticket-${data['id']}">
        <td>
            <a href="${Routing.generate('formalibre_ticket_open', {ticket: data['id']})}">
                <span class="ticket-title">
                    ${data['title']}
                </span>
            </a>
        </td>
        <td>
            ${data['creationDate']}
        </td>
        <td class="ticket-type">
            ${Translator.trans(data['type'], {}, 'support')}
        </td>
        <td class="ticket-status">
            ${Translator.trans(data['status'], {}, 'support')}
        </td>
        <td class="text-center">
            <button class="btn btn-default btn-sm edit-ticket-btn"
                    data-ticket-id="${data['id']}"
                    data-toggle="tooltip"
                    title="${Translator.trans('edit', {}, 'platform')}"
            >
                <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm delete-ticket-btn"
                    data-ticket-id="${data['id']}"
                    data-toggle="tooltip"
                    title="${Translator.trans('delete', {}, 'platform')}"
            >
                <i class="fa fa-trash"></i>
            </button>
        </td>
    </tr>
  `
  $('#no-ongoing-ticket-alert').hide('slow')
  $('#ongoing-tickets-list').append(ticket)
  $('#ongoing-ticket-tab-body').removeClass('hidden')
  const nbOngoing = parseInt($('#ongoing-tickets-tab-badge').html())
  $('#ongoing-tickets-tab-badge').html(nbOngoing + 1)
}

const updateTicket = function (data) {
  $(`#row-ticket-${data['id']} .ticket-title`).html(data['title'])
  $(`#row-ticket-${data['id']} .ticket-type`).html(Translator.trans(data['type'], {}, 'support'))
  $(`#row-ticket-${data['id']} .ticket-status`).html(Translator.trans(data['status'], {}, 'support'))
}

const removeTicket = function (event, ticketId) {
  const nbOngoing = parseInt($('#ongoing-tickets-tab-badge').html())
  $('#ongoing-tickets-tab-badge').html(nbOngoing - 1)
  $(`#row-ticket-${ticketId}`).remove()
  $(`#ticket-tab-${ticketId}`).remove()
}