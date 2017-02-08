import $ from 'jquery'
import 'moment'
import 'eonasdan-bootstrap-datetimepicker'
import 'jquery-ui'
import 'fullcalendar'

import modal from '#/main/core/_old/modal'

$('#calendar').fullCalendar({
  header: {
    left: 'false',
    center: 'false',
    right: 'false'
  },
  defaultView: 'agendaWeek',
  lang: 'fr',
  weekends: true,
  editable: false,
  firstDay: 1,
  businessHours: {dow: [1, 2, 3, 4, 5, 6]},
  defaultTimedEventDuration: window.duration,
  forceEventDuration: true,
  timeFormat: 'H(:mm)',
  columnFormat: 'dddd',
  titleFormat: 'Horaire type',
  minTime: window.minTime,
  maxTime: window.maxTime,
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  // slotDuration:'{{duration}}',
  eventLimit: true, // allow "more" link when too many events

  events: window.events,
  eventClick: function(calEvent, jsEvent) {
    jsEvent.preventDefault()
    modal.displayForm(
      calEvent.url,
      function() {
        window.location.reload()
      },
      function() {},
      'ModifHoraireForm'
    )
  }
})

$(function() {
  $('#form_start').datetimepicker({
    format: 'HH:mm',
    locale: 'fr',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down'
    }
  })
})

$(function() {
  $('#form_end').datetimepicker({
    format: 'HH:mm',
    locale: 'fr',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down'
    }
  })
})
