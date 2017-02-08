import $ from 'jquery'

/* global Routing */

var currentQuestionId
var surveyId

$('.view-question-btn').on('click', function () {
  currentQuestionId = $(this).data('question-id')
  surveyId = $(this).data('survey-id')

  $.ajax({
    url: Routing.generate(
      'claro_survey_typed_question_display',
      {
        'survey': surveyId,
        'question': currentQuestionId
      }
    ),
    type: 'GET',
    success: function (datas) {
      $('#view-question-body').html(datas)
      $('#view-question-box').modal('show')
    }
  })
})

$('.delete-question-btn').on('click', function () {
  currentQuestionId = $(this).data('question-id')
  surveyId = $(this).data('survey-id')
  $('#delete-question-validation-box').modal('show')
})

$('#delete-question-confirm-ok').on('click', function () {
  $('#delete-question-validation-box').modal('hide')

  window.location = Routing.generate(
    'claro_survey_question_delete',
    {
      'question': currentQuestionId,
      'survey': surveyId
    }
  )
})
