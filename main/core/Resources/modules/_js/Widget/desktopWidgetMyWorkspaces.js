import $ from 'jquery'

/* global Routing */

var widgetInstanceId = window.widgetInstanceId

function menuHighlightMode () {
  var mode = window.mode

  if (mode === 1) {
    $('#all-my-workspaces-btn-' + widgetInstanceId).removeClass('active')
    $('#favourite-workspaces-btn-' + widgetInstanceId).addClass('active')
  } else {
    $('#favourite-workspaces-btn-' + widgetInstanceId).removeClass('active')
    $('#all-my-workspaces-btn-' + widgetInstanceId).addClass('active')
  }
}

$('#all-my-workspaces-btn-' + widgetInstanceId).on('click', function (e) {
  e.stopImmediatePropagation()
  e.preventDefault()

  var active = $(this).hasClass('active')

  if (!active) {
    $.ajax({
      url: Routing.generate('claro_display_workspaces_widget', {'mode': 0}),
      type: 'GET',
      success: function (datas) {
        $('#workspaces-list-element-' + widgetInstanceId).html(datas)
        $('#favourite-workspaces-btn-' + widgetInstanceId).removeClass('active')
        $('#all-my-workspaces-btn-' + widgetInstanceId).addClass('active')
      }
    })
  }
})

$('#favourite-workspaces-btn-' + widgetInstanceId).on('click', function (e) {
  e.stopImmediatePropagation()
  e.preventDefault()

  var active = $(this).hasClass('active')

  if (!active) {
    $.ajax({
      url: Routing.generate('claro_display_workspaces_widget', {'mode': 1}),
      type: 'GET',
      success: function (datas) {
        $('#workspaces-list-element-' + widgetInstanceId).html(datas)
        $('#all-my-workspaces-btn-' + widgetInstanceId).removeClass('active')
        $('#favourite-workspaces-btn-' + widgetInstanceId).addClass('active')
      }
    })
  }
})

$(document).ready(function () {
  menuHighlightMode()
})
