import $ from 'jquery'
import {asset} from '#/main/core/asset'

$('#ticket-comment-form-box').on('click', '#add-comment-btn', function (e) {
  e.stopImmediatePropagation()
  e.preventDefault()

  const form = document.getElementById('comment-create-form')
  const action = form.getAttribute('action')
  const formData = new FormData(form)

  $.ajax({
    url: action,
    data: formData,
    type: 'POST',
    processData: false,
    contentType: false,
    success: function(data, textStatus, jqXHR) {
      switch (jqXHR.status) {
        case 201:
          $('#comment_form_content').html('')
          addComment(data)
          break
        default:
          $('#ticket-comment-form-box').html(data)
      }
    }
  })
})

$('#ticket-open-head').on('click', '#ticket-edit-btn', function () {
  const ticketId = $(this).data('ticket-id')

  window.Claroline.Modal.displayForm(
    Routing.generate('formalibre_ticket_edit_modal_form', {'ticket': ticketId}),
    refreshPageAfterEdition,
    function() {}
  )
})

const refreshPageAfterEdition = function () {
  $('#ticket_form_description').html('')
  window.location.reload()
}

const addComment = function (data) {
  const picture = data['user']['picture'] ?
    `
      <img src="${asset('uploads/pictures/' + data['user']['picture'])}"
           class="media-object comment-picture"
           alt="${data['user']['firstName']} ${data['user']['lastName']}"
      >
    ` :
    `
      <h1 class="profile_picture_placeholder">
          <i class="fa fa-user"></i>
      </h1>
    `

  const comment = `
    <div class="media comment-row" id="row-comment-${data['comment']['id']}">
        <div class="comment-contact col-md-2 col-sm-2 text-center comment-contact-left">
            ${picture}
            ${data['user']['firstName']}
            ${data['user']['lastName']}
            <br>
            ${data['comment']['creationDate']}
        </div>
        <div class="comment-content col-md-10 col-sm-10 comment-content-right">
            <div>
                ${data['comment']['content']}
            </div>
        </div>
    </div>
  `
  $('#comments-list').prepend('<hr>')
  $('#comments-list').prepend(comment)
}