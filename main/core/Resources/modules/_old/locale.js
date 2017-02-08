import $ from 'jquery'
import modal from './modal'

/* global Routing */

$('body').on('click', '.locale-select', function () {
  if (!$(this).parents('.modal').get(0)) {
    modal.fromRoute('claroline_locale_select')
  } else {
    $.ajax(Routing.generate('claroline_locale_change', {'locale': $(this).html().toLowerCase()}))
      .done(function () {
        // window.location.reload() does not work with post request
        var form = document.createElement('form')
        form.action = document.URL
        form.method = 'post'
        document.body.appendChild(form)
        form.submit()
      })
  }
})
