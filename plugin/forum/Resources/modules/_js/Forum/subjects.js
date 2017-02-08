import $ from 'jquery'

/* global Routing */
/* global Twig */
/* global ModalWindow */
/* global ValidationFooter */
/* global Translator */

function createValidationBox () {
  var html = Twig.render(
    ModalWindow,
    {'footer': Twig.render(ValidationFooter), 'isHidden': true, 'modalId': 'confirm-modal', 'body': Translator.trans('remove_subject_confirm_message', {}, 'forum')}
  )
  $('body').append(html)
}

createValidationBox()
var tmpRoute = ''
var tmpEl = undefined

$('body').on('click', '#delete-subject', function (event) {
  event.preventDefault()
  $('#confirm-modal').modal('show')
  tmpRoute = event.currentTarget.href
  tmpEl = event.currentTarget
})

$('body').on('click', '#modal-valid-button', function () {
  $('#confirm-modal').modal('hide')
  $.ajax({
    url: tmpRoute,
    success: function () {
      $(tmpEl)[0].parentElement.parentElement.remove()
    }
  })
})
$('#max-select').on('change', function () {
  window.location.href = Routing.generate(
    'claro_forum_subjects',
    {'category': window.categoryId, 'max': $(this).val()}
  )
})
