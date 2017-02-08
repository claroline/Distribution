import $ from 'jquery'

import modal from '../../../modal'

/* global Translator */
/* global Twig */
/* global ModelRow */

$('.create-modal-form').on('click', function (event) {
  event.preventDefault()
  modal.displayForm(
    $(event.target).attr('href'),
    addModel,
    function () {},
    'model-form'
  )
})

$('body').on('click', '.delete-model-link', function (event) {
  event.preventDefault()
  modal.confirmRequest(
    $(event.currentTarget).attr('href'),
    removeModel,
    undefined,
    Translator.trans('remove_model_comfirm', {}, 'platform'),
    Translator.trans('remove_model', {}, 'platform')
  )
})

$('body').on('click', '.rename-model-link', function (event) {
  event.preventDefault()
  modal.displayForm(
    $(event.target).attr('href'),
    editModel,
    function () {},
    'model-form'
  )
})

var addModel = function (model) {
  var html = Twig.render(ModelRow, {'model': model})
  $('#table-model-body').append(html)
  $('#no-model-div').hide()
  $('.model-list').show()
}

var removeModel = function (event, args, model) {
  $('#model-' + model.id).remove()
}

var editModel = function (model) {
  $('#model-' + model.id + ' td:first-child').html(model.name)
}
