/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "enterFullscreen" }] */

import $ from 'jquery'

function RunPrefixMethod (obj, method) {
  var pfx = ['webkit', 'moz', 'ms', 'o', '']
  var p = 0, m, t

  while (p < pfx.length && !obj[m]) {
    m = method
    if (pfx[p] == '') {
      m = m.substr(0, 1).toLowerCase() + m.substr(1)
    }
    m = pfx[p] + m
    t = typeof obj[m]
    if (t != 'undefined') {
      pfx = [pfx[p]]
      return (t == 'function' ? obj[m]() : obj[m])
    }
    p++
  }
}

function enterFullscreen (element) {
  if (RunPrefixMethod(document, 'FullScreen') || RunPrefixMethod(document, 'IsFullScreen')) {
    RunPrefixMethod(document, 'CancelFullScreen')
  } else {
    RunPrefixMethod(element, 'RequestFullScreen')
  }
}

$('#image-player').on('slid.bs.carousel', function () {
  var title = $('.item.active', this).data('name')
  var id = $('.item.active', this).data('id')
  $('.panel-heading .panel-title').html(title)
  $('.breadcrumb li').last().html(title)
  $('.panel-footer .btn.btn-primary').attr('href', $('.panel-footer .btn.btn-primary').attr('href').replace(/(ids\[\]=)[^\&]+/, '$1' + id))
})
