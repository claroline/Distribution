import modal from '#/main/core/_old/modal'
import $ from 'jquery'

$('.exception-action-btn').on('click', function () {
  var url = $(this).data('url')
  var displayMode = $(this).data('display-mode')

  if (displayMode === 'modal_form') {
    modal.displayForm(
      url,
      function () {},
      function () {}
    )
  } else {
    window.location = url
  }
})
