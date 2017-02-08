import table from '#/main/core/_old/table'
import $ from 'jquery'

/* global Routing */
/* global Translator */
/* global removeMessageConfirm */

let parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.normal = {'route': 'claro_message_list_received', 'parameters': {}}
parameters.route.search = {'route': 'claro_message_list_received_search', 'parameters': {}}
parameters.route.action.remove = {'route': 'claro_message_soft_delete', 'parameters': {}, 'confirmTemplate': removeMessageConfirm, 'delete': true}
table.initialize(parameters)

$('tr.pointer-hand').on('click', function (event) {
  var targetClass = event.target.className
  if (targetClass !== 'chk-item' && targetClass !== 'fa fa-envelope') {
    window.document.location = $(this).attr('data-route')
  }
})

$('.mark-as-read').on('click', function (e) {
  e.preventDefault()
  $.ajax({
    type: 'GET',
    url: $(e.currentTarget).attr('href'),
    success: function () {
      $(e.target).css('color', 'green')
      $(e.target).attr('class', 'fa fa-check-circle')
      var row = $(e.target)[0].parentElement.parentElement.parentElement
      $(row).addClass('active')
    }
  })
})

$('#check-notifications').on('change', function () {
  var val = ($('#check-notifications').is(':checked')) ? 1 : 0
  $.ajax({
    type: 'POST',
    url: Routing.generate('claro_message_notification', {'isNotified': val}),
    success: function () {
      var translationKey = (val === 0) ? 'notification_deactivated' : 'notification_activated'
      var toAppend = '<div class="alert alert-info">' +
        '<a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>' +
        Translator.trans(translationKey, {}, 'platform') +
        '</div>'
      $('#flashbox').html(toAppend)
    }
  })
})
