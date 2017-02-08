import modal from '../modal'
import $ from 'jquery'

/* global Routing */

function deleteTheme (id) {
  var url = Routing.generate('claro_admin_theme_delete', { id: id })

  $.ajax(url, { type: 'DELETE' })
    .done(function () {
      window.location = Routing.generate('claro_admin_theme_list')
    })
}

$('body').on('click', '.theme-list .btn.dele', function () {
  var id = $(this).data('id')
  modal.fromRoute('claro_theme_confirm', {}, function (element) {
    element.on('click', '.btn.delete', function () {
      deleteTheme(id)
    })
  })
})
  .on('click', '.theme-list .alert .close', function () {
    var id = $(this).data('id')
    modal.fromRoute('claro_theme_confirm', {}, function (element) {
      element.on('click', '.btn.delete', function () {
        deleteTheme(id)
      })
    })
  })
  .on('click', '.theme-value .btn', function () {
    var color = $('input', this.parentNode.parentNode).val()

    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
      $(this).colorpicker('setValue', color)
    }
  })

$('.theme-value .btn').each(function () {
  $(this).colorpicker().on('changeColor', function (event) {
    $('input', this.parentNode.parentNode).val(event.color.toHex())
  })
})
