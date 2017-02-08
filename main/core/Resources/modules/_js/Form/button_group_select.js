import $ from 'jquery'

$(document).ready(function () {
  var optionsHTML = `<div id='btngroup-${window.formId}' class='btn-group'>`
  var curValue = $(`#${window.formId}`).val()
  $(`#${window.formId} option`).each(function () {
    var activeClass = (curValue == $(this).attr('value')) ? ' active' : ''
    optionsHTML += '<a class=\'btn' + activeClass + ' btn-default button-group-select btn-sm\' value=\'' + $(this).attr('value') + ' role=\'button\'>' + $(this).text() + '</a>'
  })
  optionsHTML += '</div>'
  $(`#${window.formId}`).after(optionsHTML)
  $(`#${window.formId}`).hide()
  $(`#btngroup-${window.formId} .button-group-select`).click(function () {
    $(`#btngroup-${window.formId} .button-group-select`).removeClass('active')
    $(this).addClass('active')
    $(`#${window.formId}`).val($(this).attr('value'))
  })
})
