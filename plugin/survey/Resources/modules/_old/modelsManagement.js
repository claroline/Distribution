import $ from 'jquery'

/* global Routing */

var modelId
var surveyId

$('.delete-model-btn').on('click', function () {
  modelId = $(this).data('model-id')
  surveyId = $(this).data('survey-id')
  $('#delete-model-validation-box').modal('show')
})

$('#delete-model-confirm-ok').on('click', function () {
  $('#delete-model-validation-box').modal('hide')

  window.location = Routing.generate(
    'claro_survey_model_delete',
    {
      'model': modelId,
      'survey': surveyId
    }
  )
})
