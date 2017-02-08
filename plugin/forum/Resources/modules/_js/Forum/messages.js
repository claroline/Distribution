import home from '#/main/core/_old/home/home'
import modal from '#/main/core/_old/modal'
import $ from 'jquery'

/* global Routing */
/* global Twig */
/* global ModalWindow */
/* global ValidationFooter */
/* global removeMessageConfirm */
/* global tinymce */ //from claroline/tinymce

const canPost = window.canPost
const isModerator = window.isModerator
const subjectId = window.subjectId

$('#max-select').on('change', function() {
  window.location.href = Routing.generate(
    'claro_forum_messages',
    {'subject': subjectId, 'max': $(this).val()}
  )
})

if (canPost) {
  $('body').on('click', '#submit-message', function() {
    var content = $('textarea.claroline-tiny-mce').val()
    var token = $('#forum_message_form__token').val()

    if (content != undefined && content != '') {
      tinymce.claroline.disableBeforeUnload = true
      $.post(home.path + 'forum/create/message/' + subjectId,
        {
          'forum_message_form[_token]': token,
          'forum_message_form[content]': content
        }
      )
        .done(
          function() {
            window.location.reload()
          }
      )
        .error(
          function() {
            modal.error()
          }
      )
    }
  })
  $('body').on('click', '#fast-reply-btn', function() {
    $('.fast-reply').show()
  })
}

function createValidationBox() {
  var html = Twig.render(
    ModalWindow,
    {'footer': Twig.render(ValidationFooter), 'isHidden': true, 'modalId': 'confirm-modal', 'body': Twig.render(removeMessageConfirm, {'nbItems': 1})}
  )
  $('body').append(html)
}

if (isModerator) {
  createValidationBox()
  var tmpRoute = ''
  var tmpEl = undefined

  $('body').on('click', '#delete-message', function(event) {
    event.preventDefault()
    $('#confirm-modal').modal('show')
    tmpRoute = event.currentTarget.href
    tmpEl = event.currentTarget
  })

  $('body').on('click', '#modal-valid-button', function() {
    $('#confirm-modal').modal('hide')
    $.ajax({
      url: tmpRoute,
      success: function() {
        $(tmpEl)[0].parentElement.parentElement.parentElement.remove()
      }
    })
  })
}
