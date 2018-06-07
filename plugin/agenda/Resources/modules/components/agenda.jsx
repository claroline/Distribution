import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'

import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {getApiFormat} from '#/main/core/scaffolding/date'

import {MODAL_DATA_FORM} from '#/main/core/data/form/modals'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {actions} from '#/plugin/agenda/actions'
import {PageContainer, PageHeader, PageActions} from '#/main/core/layout/page'

import {Calendar} from '#/plugin/agenda/components/calendar.jsx'
import {TaskBar} from '#/plugin/agenda/components/task-bar.jsx'
import {Event} from '#/plugin/agenda/components/event.jsx'

import {MODAL_EVENT} from '#/plugin/agenda/components/modal'

import $ from 'jquery'

function arrayTrans(key) {
  if (typeof key === 'object') {
    var transWords = []
    for (var i = 0; i < key.length; i++) {
      transWords.push(trans(key[i], {}, 'agenda'))
    }
    return transWords
  }
}

function convertDateTimeToString(value, isAllDay, isEndDate) {
  if (!value)
    return isAllDay && isEndDate ?
      moment(value).subtract(1, 'minutes').format('DD/MM/YYYY HH:mm'):
      moment(value).format('DD/MM/YYYY HH:mm')
}

function sanitize(event) {
  const data = cloneDeep(event)
  data.start = event.start.format(getApiFormat())
  data.end = event.end.format(getApiFormat())
  delete data.source

  return data
}

const form = [
  {
    title: trans('general'),
    primary: true,
    fields: [{
      name: 'title',
      type: 'string',
      label: trans('title'),
      required: true
    }, {
      name: 'description',
      type: 'textarea',
      label: trans('description'),
      required: true
    }]
  },
  {
    title: trans('properties'),
    fields: [{
      name: 'task',
      type: 'boolean',
      label: trans('task'),
      required: true
    },
    {
      name: 'allDay',
      type: 'boolean',
      label: trans('allDay'),
      required: true,
      options: {
        time: true
      }
    },
    {
      name: 'start',
      type: 'date',
      label: trans('start'),
      required: true,
      options: {
        time: true
      }
    },
    {
      name: 'end',
      type: 'date',
      label: trans('end'),
      required: true,
      options: {
        time: true
      }
    }]
  }
]

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
      //aussi il faudra virer le routing.generate ici (filtrer par workspace si il y a)
      /** @global Routing */
      events: Routing.generate('apiv2_event_list'), //faudra rajouter les filtres ici (pour le workspace par exemple)
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
        <div>
          <Calendar {...this.calendar} />
          <TaskBar />
        </div>
      </PageContainer>
    )
  }
}

const Agenda = connect(
  state => ({}),
  dispatch => ({
    onDayClick(calendarRef) {
      dispatch (
        modalActions.showModal('MODAL_DATA_FORM', {
          title: 'event',
          save: event => {
            dispatch(actions.create(event, calendarRef))
          },
          sections: form
        })
      )
    },
    onEventDragStart(calendarRef) {
      //calendarRef.popover('hide')
    },
    onEventDrop(calendarRef, event, delta, revertFunc, jsEvent, ui, view) {

      dispatch(actions.update(sanitize(event), calendarRef))
    },
    onEventClick(calendarRef, event) {
      dispatch (
        modalActions.showModal(MODAL_EVENT, {
          title: 'event',
          fadeModal: () => {},
          hideModal: () => {},
          show: true,
          event: sanitize(event),
          onForm: () => {
            dispatch (
              modalActions.showModal('MODAL_DATA_FORM', {
                title: 'event',
                save: event => {
                  dispatch(actions.update(event, calendarRef))
                },
                sections: form,
                data: sanitize(event)
              })
            )
          }
        })
      )
    },
    onEventDestroy() {
      //alert('destroy')
    },
    onEventRender(calendarRef, event, $element) {
      if (event.editable) {
        $element.addClass('fc-draggable')
      }

      //event.durationEditable = event.durationEditable && workspacePermissions[workspaceId] && event.isEditable !== false

    },
    onEventResize(calendarRef) {
      //calendarRef.popover('hide')
    },
    eventResizeStart(calendarRef, event, delta, revertFunc, jsEvent, ui, view) {
      const data = cloneDeep(event)
      data.start = event.start.format(getApiFormat())
      data.end = event.end.format(getApiFormat())
      delete data.source
      dispatch(actions.update(data, calendarRef))
    }
  })
)(AgendaComponent)

//export { Agenda as Agenda }

export {
  Agenda
}
