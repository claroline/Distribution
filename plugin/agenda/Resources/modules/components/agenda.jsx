import React, { Component } from 'react'

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

// port from the old code
function createPopover(event, $element) {
  /*
   * In FullCalendar >= 2.3.1, the end date is null if the start date is the same.
   * In this case, the end date is null when it's a all day event which lasts one day
   */

  /*
  if (event.end === null) {
    event.end = moment(event.start).add(1, 'days')
  }*/

  //event.start.string = convertDateTimeToString(event.start, event.allDay, false)
  //ent.end.string = convertDateTimeToString(event.end, event.allDay, true)

  $element
    .popover({
      trigger: 'click',
      title: event.title + '<button class="close">X</button>',
      content: 'utiliser l\'appli react ici',
      html: true,
      container: 'body',
      placement: 'top'
    })
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
      calendarRef.popover('hide')
    },
    onEventDrop(calendarRef, event, delta, revertFunc, jsEvent, ui, view) {
      const data = cloneDeep(event)
      data.start = event.start.format(getApiFormat())
      data.end = event.end.format(getApiFormat())
      delete data.source
      dispatch(actions.update(data, calendarRef))
    },
    onEventClick() {
      alert('click')
      /*
      dispatch (
        modalActions.showModal('MODAL_DATA_FORM', {
          title: 'event',
          onChange: () => console.log('change'),
          save: event => {
            dispatch(actions.create(event))
            //reload here
          },
          sections: form
        })
      )*/
    },
    onEventDestroy() {
      //alert('destroy')
    },
    onEventRender(calendarRef, event, $element) {
      //step 1: find workspace
      //step 2: find restrictions (according to workspace ?)
      //step 3: si editable


      if (event.editable) {
        $element.addClass('fc-draggable')
      }

      //event.durationEditable = event.durationEditable && workspacePermissions[workspaceId] && event.isEditable !== false

      /*
      if (event.isTask) {
        var eventContent =  $element.find('.fc-content')
        // Remove the date
        eventContent.find('.fc-time').remove()
        $element.css({
          'background-color': 'rgb(144, 32, 32)',
          'border-color': 'rgb(144, 32, 32)'
        })
        eventContent.prepend('<span class="task fa" data-event-id="' + event.id + '"></span>')

        // Add the checkbox if the task is not done or the check symbol if the task is done
        var checkbox = eventContent.find('.task')
        if (event.isTaskDone) {
          checkbox.addClass('fa-check-square-o')
          checkbox.next().css('text-decoration', 'line-through')
        } else {
          checkbox.addClass('fa-square-o')
        }
      }*/

      //createPopover(event, $element)
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
