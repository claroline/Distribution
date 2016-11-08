import $ from 'jquery'

let sourceId
let userId
let documentId
let documentData = []

function initializeSelect (type)
{
  documentId = null
  $('#document-selection-select').empty()
  $('#document-selection-details').empty()
  $('#submit-document-selection').prop('disabled', true)
  $.ajax({
    url: Routing.generate('api_get_cursus_populated_document_models_by_type', {type: type, sourceId: sourceId}),
    type: 'GET',
    success: function (data) {
      $('#document-selection-select').append('<option value="0" selected="selected"></option>')
      documentData = data
      data.forEach(d => {
        $('#document-selection-select').append(`<option value="${d['id']}">${d['name']}</option>`)
      })
      $('#document-selection-modal').modal('show')
    }
  })
}

$('.delete-session-user-btn').on('click', function () {
  const sessionUserId = $(this).data('session-user-id')

  window.Claroline.Modal.confirmRequest(
    Routing.generate('claro_cursus_course_session_unregister_user', {'sessionUser': sessionUserId}),
    removeSessionRow,
    sessionUserId,
    Translator.trans('unregister_user_from_session_message', {}, 'cursus'),
    Translator.trans('unregister_user_from_session', {}, 'cursus')
  )
})

$('.delete-session-event-user-btn').on('click', function () {
  const sessionEventUserId = $(this).data('session-event-user-id')

  window.Claroline.Modal.confirmRequest(
    Routing.generate('claro_cursus_session_event_unregister_user', {'sessionEventUser': sessionEventUserId}),
    removeSessionEventRow,
    sessionEventUserId,
    Translator.trans('unregister_user_from_session_event_message', {}, 'cursus'),
    Translator.trans('unregister_user_from_session_event', {}, 'cursus')
  )
})

$('.send-session-invitation-btn').on('click', function () {
  sourceId = parseInt($(this).data('session-id'))
  userId = parseInt($(this).data('user-id'))
  $('#document-selection-title').html(Translator.trans('session_invitation', {}, 'cursus'))
  initializeSelect(0)
})

$('.generate-session-certificate-btn').on('click', function () {
  sourceId = parseInt($(this).data('session-id'))
  userId = parseInt($(this).data('user-id'))
  $('#document-selection-title').html(Translator.trans('session_certificate', {}, 'cursus'))
  initializeSelect(2)
})

$('.send-session-event-invitation-btn').on('click', function () {
  sourceId = parseInt($(this).data('session-event-id'))
  userId = parseInt($(this).data('user-id'))
  $('#document-selection-title').html(Translator.trans('session_event_invitation', {}, 'cursus'))
  initializeSelect(1)
})

$('.generate-session-event-certificate-btn').on('click', function () {
  sourceId = parseInt($(this).data('session-event-id'))
  userId = parseInt($(this).data('user-id'))
  $('#document-selection-title').html(Translator.trans('session_event_certificate', {}, 'cursus'))
  initializeSelect(3)
})

$('#document-selection-select').on('change', function () {
  documentId = parseInt($(this).val())
  $('#document-selection-details').empty()
  $('#submit-document-selection').prop('disabled', true)

  if (documentId) {
    const documentModel = documentData.find(d => d['id'] === documentId)
    $('#document-selection-details').html(documentModel['content'])
    $('#submit-document-selection').prop('disabled', false)
  }
})

$('#submit-document-selection').on('click', function () {
  if (documentId > 0) {
    $.ajax({
      url: Routing.generate('api_post_cursus_document_for_user_send', {documentModel: documentId, user: userId, sourceId: sourceId}),
      type: 'POST',
      success: function () {
        $('#document-selection-modal').modal('hide')
      }
    })
  }
})

var removeSessionRow = function (event, sessionUserId) {
  $(`#session-row-${sessionUserId}`).remove()
}

var removeSessionEventRow = function (event, sessionEventUserId) {
  $(`#event-row-${sessionEventUserId}`).remove()
}