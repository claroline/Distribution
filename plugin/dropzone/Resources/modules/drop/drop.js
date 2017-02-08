import _ from 'lodash'
import $ from 'jquery'
import {} from 'jquery-ui'
import {} from '../components/popup'

$(document).ready(function() {
  let resourceNodeId = null

  window.Claroline.ResourceManager.createPicker('dropPicker', {
    callback: function(nodes) {
      resourceNodeId = _.keys(nodes)[0]
      $('.dropzone_ressrouceSelected').show()
      $('.dropzone_noRessourceSelected').hide()
      $('.selected-resource').html(name)
      $('#icap_dropzone_document_file_form_resource').val(resourceNodeId)

      $('#add-document-sumbit').removeAttr('disabled')
      $('#add-document-sumbit').trigger('click')

      $('.add-document-pending').hide()
    }
  })

  if ($('#icap_dropzone_document_file_form_file').val() != '') {
    $('.please-wait').show()
    $(this).parents('form').submit()
  }
  // autosubmit input files.
  $('#icap_dropzone_document_file_form_file').change(function() {
    $('.please-wait').show()
    $(this).parents('form').submit()
  })

  $('#icap_dropzone_document_file_form_file').parents('form').find('button').click(function(e) {
    // desactivation of the submit button ( autosubmit is activated).
    e.preventDefault()
  })

  $('a.launch-inline').on('click', function(event) {
    event.preventDefault()
    $('.disabled-during-add').attr('disabled', 'disabled')

    const launchResourcePicker = $(this).hasClass('launch-resource-picker')

    $.get($(this).attr('href'))
      .always(function() {
      })
      .done(function(data) {
        $('.container-inline').append(data)
        $('.show-during-add').show()

        if (launchResourcePicker) {
          window.Claroline.ResourceManager.picker('dropPicker')

          $('#modal-picker').on('hidden.bs.modal', function() {
            if (resourceNodeId == null) {
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
    window.Claroline.ResourceManager.picker('dropPicker')
    $('#modal-picker').unbind('hidden.bs.modal').on('hidden.bs.modal', function() {
      if (resourceNodeId == null) {
        //$('.cancel-inline').trigger('click')
      }
    })
  })

  $('#dropzone_global_save_link').click(function() {
    // test if some text or data is not save before launch modal, in order to adapt message.
    let fieldEmpty = true
    const text = $('#icap_dropzone_document_file_form_text').val()
    const url = $('#icap_dropzone_document_file_form_url').val()
    const file = $('#icap_dropzone_document_file_form_url').val()
    if ((text != '' && text != '<p></p>') || (url != '') || (file != '')) {
      fieldEmpty = false
    }

    if (!fieldEmpty) {
      $('.modal-warning').show()
    } else {
      $('.modal-warning').hide()
    }

  })
})
