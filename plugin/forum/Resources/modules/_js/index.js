import $ from 'jquery'

/* global Routing */
/* global Twig */
/* global ModalWindow */
/* global ValidationFooter */
/* global Translator */

const moderator = window.isModerator

$('#search-button').on('click', function (event) {
  event.preventDefault()
  var search = document.getElementById('search-items-txt').value
  if (search !== '') {
    var route = Routing.generate('claro_forum_search', {'forum': window.forumId, 'search': document.getElementById('search-items-txt').value})
    window.location.href = route
  }
})

function createValidationBox () {
  var html = Twig.render(
    ModalWindow,
    {
      'footer': Twig.render(ValidationFooter),
      'isHidden': true,
      'modalId': 'confirm-modal',
      'body': Translator.trans('remove_category_confirm_message', {}, 'forum')
    }
  )
  $('body').append(html)
}

if (moderator) {
  createValidationBox()
  var tmpRoute = ''
  var tmpEl = undefined

  $('body').on('click', '#delete-category', function (event) {
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
}
