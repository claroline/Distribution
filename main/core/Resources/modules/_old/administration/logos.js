import $ from 'jquery'
import modal from '../modal'

/* global Routing */

function deletelogo (element) {
  var logo = $(element).data('logo')

  if (logo && element) {
    var route = Routing.generate('claro_admin_delete_logo', {'file': logo})
    $.ajax(route)
      .done(function (data) {
        if (data === 'true') {
          $(element).hide('slow', function () {
            $(this).remove()
          })
        } else {
          modal.error()
        }
      })
      .error(function () {
        modal.error()
      })
  }
}

$('body').on('click', '.logos .logo', function () {
  $('.logos .logo').removeClass(function (index, css) {
    return (css.match(/\balert-\w+/g) || []).join(' ')
  })
  $('.logos .logo').addClass('alert-warning')

  $(this).removeClass('alert-warning')
  $(this).addClass('alert-info')
  $('.logos input[type="hidden"]').val($(this).data('logo'))
})

$('body').on('click', '.logos .logo .close', function (event) {
  event.stopPropagation()
  var logo = $(this).parents('.logo')
  modal.fromRoute('claro_content_confirm', null, function (element) {
    element.on('click', '.btn.delete', function () {
      deletelogo(logo)
    })
  })
})
