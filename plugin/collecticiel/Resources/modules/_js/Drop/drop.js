import $ from 'jquery'
import _ from 'lodash'
import resourceManager from 'claroline/resource-manager'

/* global tinymce */

//use with entry tinymce points
tinymce.claroline.configuration.toolbar1 = 'bold italic strikethrough | alignleft aligncenter alignright alignjustify | '

var resourceNodeId = null

resourceManager.createPicker('dropPicker', {
  callback: function(nodes) {
    resourceNodeId = _.keys(nodes)[0]
    $('.dropzone_ressrouceSelected').show()
    $('.dropzone_noRessourceSelected').hide()
    $('.selected-resource').html(name)
    $('#innova_collecticiel_document_file_form_resource').val(resourceNodeId)

    $('#add-document-sumbit').removeAttr('disabled')
    $('#add-document-sumbit').trigger('click')

    $('.add-document-pending').hide()
  }
})

if ($('#innova_collecticiel_document_file_form_file').val() !== '') {
  $('.please-wait').show()
  $(this).parents('form').submit()
}
// autosubmit input files.
$('#innova_collecticiel_document_file_form_file').change(function() {
  $('.please-wait').show()
  $(this).parents('form').submit()
})

$('#innova_collecticiel_document_file_form_file').parents('form').find('button').click(function(e) {
  // desactivation of the submit button ( autosubmit is activated).
  e.preventDefault()
})

$('a.launch-inline').on('click', function(event) {
  event.preventDefault()
  $('.disabled-during-add').attr('disabled', 'disabled')

  var launchResourcePicker = $(this).hasClass('launch-resource-picker')

  $.get($(this).attr('href'))
    .always(function() {})
    .done(function(data) {
      $('.container-inline').append(data)
      $('.show-during-add').show()

      if (launchResourcePicker) {
        resourceManager.picker('dropPicker')

        $('#modal-picker').on('hidden.bs.modal', function() {
          if (resourceNodeId === null) {
            $('.cancel-inline').trigger('click')
          }
        })
      }

      var top = $('.container-inline').offset().top
      top = top - 50
      $('body,html').scrollTop(top)
    })
})

$('#addRessourceButton').click(function(e) {
  e.preventDefault()
  resourceManager.picker('dropPicker')
  $('#modal-picker').unbind('hidden.bs.modal').on('hidden.bs.modal', function() {
    if (resourceNodeId === null) {
      // $('.cancel-inline').trigger('click')
    }
  })
})

$('#dropzone_global_save_link').click(function() {
  // test if some text or data is not save before launch modal, in order to adapt message.
  var fieldEmpty = true
  var text = $('#innova_collecticiel_document_file_form_text').val()
  var url = $('#innova_collecticiel_document_file_form_url').val()
  var file = $('#innova_collecticiel_document_file_form_url').val()
  if ((text !== '' && text !== '<p></p>') || (url !== '') || (file !== '')) {
    fieldEmpty = false
  }

  if (!fieldEmpty) {
    $('.modal-warning').show()
  } else {
    $('.modal-warning').hide()
  }
})
