/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "enterFullScreen" }]*/

/* global Routing */

import iframe from '../_old/iframe'
import $ from 'jquery'

iframe.resize('scorm-frame')

$(window).resize(function() {
  iframe.resize('scorm-frame')
})

function runPrefixedMethod(obj, method) {
  var pfx = ['webkit', 'moz', 'ms', 'o', '']
  var p = 0, m = null, t = null

  while (p < pfx.length && !obj[m]) {
    m = method

    if (pfx[p] == '') {
      m = m.substr(0,1).toLowerCase() + m.substr(1)
    }

    m = pfx[p] + m

    if ('undefined' !== (t = typeof obj[m])) {
      pfx = [pfx[p]]

      return t === 'function' ? obj[m]() : obj[m]
    }

    p++
  }
}

function enterFullScreen() {
  if (runPrefixedMethod(document, 'FullScreen') || runPrefixedMethod(document, 'IsFullScreen')) {
    runPrefixedMethod(document, 'CancelFullScreen')
  }
  else {
    runPrefixedMethod(document.getElementById('scorm-frame'), 'RequestFullScreen')
  }
}

$('#menu-display-btn').on('click', function() {
  if ($('#menu-box').hasClass('hidden')) {
    $('#content-box').removeClass('col-md-12')
    $('#content-box').addClass('col-md-9')
    $('#menu-box').removeClass('hidden')
  } else {
    $('#menu-box').addClass('hidden')
    $('#content-box').removeClass('col-md-9')
    $('#content-box').addClass('col-md-12')
  }
})

$('#configuration-btn').on('click', function() {
  var resourceId = $(this).data('resource-id')
  window.Claroline.Modal.displayForm(
        Routing.generate('claro_scorm_12_configuration_edit_form', {'scorm': resourceId}),
        refreshPage,
        function() {}
    )
})

var refreshPage = function() {
  window.location.reload()
}
