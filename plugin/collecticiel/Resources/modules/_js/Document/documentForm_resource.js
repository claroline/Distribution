import $ from 'jquery'

$(document).ready(function () {
  $('#addRessourceInput').click(function () {
    $('#addRessourceButton').click()
  })

  $('#innova_collecticiel_document_file_form_url').focusout(function () {
    var val = $('#innova_collecticiel_document_file_form_url').val()
    if (val.substr(0, 7) !== 'http://' && val.substr(0, 8) !== 'https://') {
      $('#innova_collecticiel_document_file_form_url').val('http://' + val)
    }
  })

  $('#innova_collecticiel_document_file_form_url').keypress(function (event) {
    if (event.keyCode === 13) {
      $('#innova_collecticiel_document_file_form_url').focusout()
    }
  })
})
