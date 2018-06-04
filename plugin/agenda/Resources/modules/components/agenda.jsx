import React, { Component } from 'react'

import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'

import {MODAL_DATA_FORM} from '#/main/core/data/form/modals'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {PageContainer, PageHeader, PageActions} from '#/main/core/layout/page'

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

    this.calendar = {
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
      timezone: 'local',
      eventDrop: props.onEventDrop,
      eventDragStart: props.onEventDragStart,
      dayClick: props.onDayClick,
      eventClick:  props.onEventClick,
      eventDestroy: props.onEventDestroy,
      eventRender: props.onEventRender,
      eventResize: props.onEventResize,
      eventResizeStart: props.onEventResizeStart
    }
  }

  render() {
    return (
      <PageContainer>
        <PageHeader title={trans('agenda', {}, 'tool')}></PageHeader>
        <Calendar {...this.calendar} />
      </PageContainer>
    )
  }

}

const Agenda = connect(
  state => ({

  }),
  dispatch => ({
    onDayClick() {
      dispatch(
        modalActions.showModal(MODAL_DATA_FORM, {
          title: 'title',
          sections: [
            {
              title: trans('general'),
              primary: true,
              fields: [
                {
                  name: 'name',
                  type: 'string',
                  label: trans('name'),
                  required: true
                }
              ]
            }
          ]
        })
      )
    },
    onEventDragStart() {
      alert('drag')
    },
    onEventDrop() {
      alert('drop')
    },
    onEventClick() {
      alert('click')
    },
    onEventDestroy() {
      alert('destroy')
    },
    onEventRender() {
      alert('render')
    },
    onEventResize() {
      alert('resize')
    },
    eventResizeStart() {
      alert('resizeStart')
    }
  })
)(AgendaComponent)

//export { Agenda as Agenda }

export {
  Agenda
}
