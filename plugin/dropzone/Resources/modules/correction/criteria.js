import $ from 'jquery'
import '../components/popup'

$(document).on('ready', function () {
  $('#icap_dropzone_correct_criteria_page_form_goBack').val(0)
  $('.back-button').on('click', function(event) {
    event.preventDefault()
    $('#icap_dropzone_correct_criteria_page_form_goBack').val(1)
    $('#correct-form button[type="submit"]').trigger('click')
  })

  $('.column-container-div input[type="radio"]').on('click', function () {
    const name = $(this).attr('name')
    const value = $(this).val()

    const test = '.criterion-grade[data-criterion="'+name+'"]'
    $(test).html(value)
  })

  const calculateTotalGrade = function () {
    const totalGrade = 20
    $('.correctionGrade').html(totalGrade)
  }

  calculateTotalGrade()
})
