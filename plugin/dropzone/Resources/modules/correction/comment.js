import $ from 'jquery'
import tinymce from 'tinymce/tinymce'

$(document).on('ready', function() {
  $('#icap_dropzone_correct_comment_form_goBack').val(0)
  $('.back-button').on('click', function(event) {
    event.preventDefault()
    $('#icap_dropzone_correct_comment_form_goBack').val(1)
    $('#correct-form button[type="submit"]').trigger('click')
  })

  if (window.dropzone.showCommentInCorrection) {
    $('#correct-form').submit(function(e) {
      if ($('#icap_dropzone_correct_comment_form_comment').val() == '') {
        e.preventDefault()
        setRequireStyle()
        tinymce.get('icap_dropzone_correct_comment_form_comment').on('keyup', () => {
          if (tinymce.get('icap_dropzone_correct_comment_form_comment').getContent() != '') {
            removeRequiredStyle()
          }
        })
      }
    })
  }
})

function removeRequiredStyle() {
  $('#comment_part_div').removeClass('required')
  $('.required_text').hide()
}

function setRequireStyle() {
  $('#comment_part_div').addClass('required')
  $('.required_text').show()
}
