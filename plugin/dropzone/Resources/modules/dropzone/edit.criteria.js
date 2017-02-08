import $ from 'jquery'
import tinymce from 'tinymce/tinymce'
import '../components/popup'

let manualSubmit = false

$(document).ready(function() {
  setSaveListener()
  $('#icap_dropzone_criteria_form_goBack').val(0)
  $('.back-button').on('click', function(event) {
    event.preventDefault()
    $('#icap_dropzone_criteria_form_goBack').val(1)
    $('.save-submit').trigger('click')
  })

  $('.column-input').hide()
  $('.column-input-js').show()


  $('#icap_dropzone_criteria_form_allowCommentInCorrection').on('click', function() {
    if (window.dropzone.comment == 0) {
      window.dropzone.comment = 1
    } else {
      window.dropzone.comment = 0
    }
    $('.comment-input input').val(window.dropzone.comment)
  })

  let setColumnInput = function() {
    $('.column-container').empty()
    for (let i = 0; i < window.dropzone.totalColumn; i++) {
      $('.column-container').append('<input type="radio" disabled style="margin-right: 4px; margin-left: 0px; padding-right: 0px; padding-left: 0px"/>')
    }
  }

  $('.add-column').on('click', function(event) {
    event.preventDefault()
    if (window.dropzone.totalColumn < 10) {
      window.dropzone.totalColumn++
      setColumnInput()

      $('.column-input input').val(window.dropzone.totalColumn)
    }
  })

  $('.remove-column').on('click', function(event) {
    event.preventDefault()
    if (window.dropzone.totalColumn > 3) {
      window.dropzone.totalColumn--
      setColumnInput()

      $('.column-input input').val(window.dropzone.totalColumn)
    }
  })

  function resetTiny() {
    tinymce.remove()
  }

//let form_count = 0
  $('.add-criterion-button').on('click', function(event) {
    event.preventDefault()

    $('.disabled-during-edition').attr('disabled', 'disabled')
    tinymce.get('icap_dropzone_criteria_form_correctionInstruction').getBody().setAttribute('contenteditable', false)
    //$('.icap_dropzone_criteria_form_correctionInstruction').attr('disabled','disabled')
    $('.criteria-form-button').attr('disabled', 'disabled')

    //let criterionId = $(this).data('criterion')
    let $form = $('#global_form')
    $('#addCriteriaReRouting').val('add-criterion')
    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: $form.serialize(),
      success: function() {
        $.get($('.add-criterion-button').attr('href'))
          .done(function(data) {
            resetTiny()
            $('.new-criteria-zone').empty()
            $('.criterion-row .criterion-edit').empty()

            $('.template .template-criteria-zone').clone().appendTo('.new-criteria-zone')
            $('.new-criteria-zone .new-criteria-form').append(data)

            $('.column-input input').val(window.dropzone.totalColumn)
            $('.comment-input input').val(window.dropzone.comment)

            $('.add-criteria-zone').hide()
            $('.new-criteria').show()
            $('.new-criteria-zone .template-criteria-zone').show()

            $('.new-criteria-zone .template-criteria-zone .form-buttons').hide()

            $('.add-remove-column').show()

            let top = $('#new-criteria').offset().top
            top = top - 50
            $('body,html').scrollTop(top)
            setSaveListener()
          })


      }
    })
  })

  $('.delete-criteria-button').click(function(event) {
    event.preventDefault()
    let $form = $('#global_form')
    $('#addCriteriaReRouting').val('add-criterion')
    let $link = $(this)
    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: $form.serialize(),
      success: function() {
        $.get($link.attr('href'))
      }
    })

  })

  let temp_edit_criteria_url = null
  $('.edit-criterion-button').on('click', function(event) {
    event.preventDefault()
    temp_edit_criteria_url = $(this).attr('href')
    $('.disabled-during-edition').attr('disabled', 'disabled')
    $('.criteria-form-button').attr('disabled', 'disabled')

    let criterionId = $(this).data('criterion')
    let $form = $('#global_form')
    $('#addCriteriaReRouting').val('add-criterion')

    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: $form.serialize(),
      success: function() {
        $.get(temp_edit_criteria_url)
          .done(function(data) {
            temp_edit_criteria_url = null
            resetTiny()
            $('.new-criteria-zone').empty()
            $('.criterion-row .criterion-edit').empty()

            $('.template .template-criteria-zone').clone().appendTo('#' + criterionId + '  .criterion-edit')
            $('#' + criterionId + ' .criterion-edit .new-criteria-form').append(data)
            $('#' + criterionId + ' .criterion-edit .form-cancel').data('criterion', criterionId)
            $('.column-input input').val(window.dropzone.totalColumn)
            $('.comment-input input').val(window.dropzone.comment)

            $('#' + criterionId + '  .criterion-show').hide()
            $('#' + criterionId + '  .criterion-edit').show()
            $('#' + criterionId + '  .criterion-edit  .template-criteria-zone').show()

            $('#' + criterionId + ' .criterion-edit  .template-criteria-zone .form-buttons').hide()

            setSaveListener()
          })
      }
    })


  })

  $('form').submit(function(e) {
    if (window.dropzone.nbCorrection > 0 && !manualSubmit) {
      e.preventDefault()
      $('#recalculateAskPopup').modal('show')
      manualSubmit = true
      $('#recalculateButton').unbind('click').click(function() {
        $('#icap_dropzone_criteria_form_recalculateGrades').val(1)
        $('form').submit()
      })

      $('#notRecalculateButton').unbind('click').click(function() {
        $('form').submit()
      })
    }
  })


})

function setSaveListener() {
  $('.form-submit').unbind('click').click(function(event) {
    event.preventDefault()
    //I do the "click" on submit button for keep html5 warning
    $('.inline-body button[type="submit"]').trigger('click')
  })

  $('.form-cancel').unbind('click').click(function(event) {
    event.preventDefault()
    let criterionId = $(this).data('criterion')
    if (criterionId == 'new') {
      $('.new-criteria').hide()
      $('.add-criteria-zone').show()

      if ((window.dropzone.nbResults == 0) ? 'true' : 'false') {
        $('.add-remove-column').hide()
      }
    } else {
      $('#' + criterionId + ' .criterion-edit').hide()
      $('#' + criterionId + ' .criterion-show').show()
    }

    $('.disabled-during-edition').attr('disabled', null)
    $('.criteria-form-button').attr('disabled', null)
    tinymce.get('icap_dropzone_criteria_form_correctionInstruction').getBody().setAttribute('contenteditable', true)
  })
}
