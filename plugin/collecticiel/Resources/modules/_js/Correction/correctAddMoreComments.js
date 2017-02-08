import $ from 'jquery'

$('#innova_collecticiel_correct_criteria_page_form_goBack').val(0)
$('.back-button').on('click', function (event) {
  event.preventDefault()
  $('#innova_collecticiel_correct_criteria_page_form_goBack').val(1)
  $('#correct-form button[type="submit"]').trigger('click')
})

$('.column-container-div input[type="radio"]').on('click', function () {
  var name = $(this).attr('name')
  var value = $(this).val()

  var test = '.criterion-grade[data-criterion="' + name + '"]'
  $(test).html(value)
})

var calculateTotalGrade = function () {
  var totalGrade = 20

  $('.correctionGrade').html(totalGrade)
}

calculateTotalGrade()
