import React, { Component } from 'react'

import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'

import {Calendar} from '#/plugin/agenda/components/calendar.jsx'

function arrayTrans(key) {
  if (typeof key === 'object') {
    var transWords = []
    for (var i = 0; i < key.length; i++) {
      transWords.push(trans(key[i], {}, 'agenda'))
    }
    return transWords
  }
}

class AgendaComponent extends Component {
  constructor(props) {

    super(props)

    this.AgendaComponentcalendar = {
      header: {
        left: 'prev,next, today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      buttonText: {
        prev: trans('prev', {}, 'agenda'),
        next: trans('next', {}, 'agenda'),
        prevYear: trans('prevYear', {}, 'agenda'),
        nextYear: trans('nextYear', {}, 'agenda'),
        today: trans('today', {}, 'agenda'),
        month: trans('month_', {}, 'agenda'),
        week: trans('week', {}, 'agenda'),
        day: trans('day_', {}, 'agenda')
      },
      firstDay: 1,
      monthNames: arrayTrans(['month.january', 'month.february', 'month.march', 'month.april', 'month.may', 'month.june', 'month.july', 'month.august', 'month.september', 'month.october', 'month.november', 'month.december']),
      monthNamesShort: arrayTrans(['month.jan', 'month.feb', 'month.mar', 'month.apr', 'month.may', 'month.ju', 'month.jul', 'month.aug', 'month.sept',  'month.oct', 'month.nov', 'month.dec']),
      dayNames: arrayTrans(['day.sunday', 'day.monday', 'day.tuesday', 'day.wednesday', 'day.thursday', 'day.friday', 'day.saturday']),
      dayNamesShort: arrayTrans(['day.sun', 'day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat']),
      //This is the url which will get the events from ajax the 1st time the calendar is launched
      //events: showUrl,
      axisFormat: 'HH:mm',
      timeFormat: 'H:mm',
      agenda: 'h:mm{ - h:mm}',
      allDayText: trans('isAllDay'),
      lazyFetching : false,
      fixedWeekCount: false,
      eventLimit: 4,
      timezone: 'local'/*,
      eventDrop: onEventDrop,
      eventDragStart: onEventDragStart,
      dayClick: renderAddEventForm,
      eventClick:  onEventClick,
      eventDestroy: onEventDestroy,
      eventRender: onEventRender,
      eventResize: onEventResize,
      eventResizeStart: onEventResizeStart*/
    }
  }

  render() {
    return (
      <div>
        <Calendar {...this.calendar} />
      </div>
    )
  }

}

const Agenda = connect(
  state => ({

  }),
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.open('task', id))
    }
  })
)(AgendaComponent)

//export { Agenda as Agenda }

export {
  Agenda
}
