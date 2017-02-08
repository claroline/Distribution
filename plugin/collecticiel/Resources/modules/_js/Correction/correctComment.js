import $ from 'jquery'

//use js entry point

/* global tinymce */

tinymce.claroline.configuration.toolbar1 = 'bold italic strikethrough | alignleft aligncenter alignright alignjustify | '

$(document).on('ready', function () {
  $('#innova_collecticiel_correct_comment_form_goBack').val(0)
  $('.back-button').on('click', function (event) {
    event.preventDefault()
    $('#innova_collecticiel_correct_comment_form_goBack').val(1)
    $('#correct-form button[type="submit"]').trigger('click')
  })

  if (window.forceCorrection) {
    $('#correct-form').submit(function (e) {
      if ($('#innova_collecticiel_correct_comment_form_comment').val() == '') {
        e.preventDefault()
        setRequireStyle()
        tinymce.get('innova_collecticiel_correct_comment_form_comment').on('keyup', function () {
          if (tinymce.get('innova_collecticiel_correct_comment_form_comment').getContent() != '') {
            removeRequiredStyle()
          }
        })
      }
    })
  }
})

function removeRequiredStyle () {
  $('#comment_part_div').removeClass('required')
  $('.required_text').hide()
}

function setRequireStyle () {
  $('#comment_part_div').addClass('required')
  $('.required_text').show()
}
