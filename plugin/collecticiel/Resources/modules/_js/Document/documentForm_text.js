import $ from 'jquery'

$('document').ready(function () {
  var myTextWidth = $('#innova_collecticiel_document_file_form_text').width()

  if (myTextWidth != 100) {
    myTextWidth = 100
  }

  var myDocumentWidth = (myTextWidth - 43.85) * $(window).width() / 100
  $('#innovaDocument').width(myDocumentWidth)
})
