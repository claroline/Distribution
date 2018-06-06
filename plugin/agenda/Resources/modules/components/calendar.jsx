import React, { Component } from 'react'

import cloneDeep from 'lodash/cloneDeep'
import $ from 'jquery'
//import 'moment/min/moment.min.js'

import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/fullcalendar.print.min.css'
import 'fullcalendar/dist/fullcalendar.js'

//fullcalendar wrapper
class Calendar extends Component {
  constructor(props) {
    super(props)
    this.calendarRef

    this.onEventDrop = this.onEventDrop.bind(this)
    this.onEventDragStart = this.onEventDragStart.bind(this)
    this.onDayClick = this.onDayClick.bind(this)
    this.onEventClick = this.onEventClick.bind(this)
    this.onEventDestroy = this.onEventDestroy.bind(this)
    this.onEventRender = this.onEventRender.bind(this)
    this.onEventResize = this.onEventResize.bind(this)
    this.onEventResizeStart = this.onEventResizeStart.bind(this)
  }

  onEventDrop(event, delta, revertFunc, jsEvent, ui, view) {
    this.props.eventDrop($(this.calendarRef), event, delta, revertFunc, jsEvent, ui, view)
  }

  onEventDragStart() {
    this.props.eventDragStart($(this.calendarRef))
  }
  onDayClick() {
    this.props.dayClick($(this.calendarRef))
  }

  onEventClick() {
    this.props.eventClick($(this.calendarRef))
  }

  onEventDestroy() {
    this.props.eventDestroy($(this.calendarRef))
  }

  onEventRender(event, $element) {
    this.props.eventRender($(this.calendarRef), event, $element)
  }

  onEventResize() {
    this.props.eventResize($(this.calendarRef))
  }

  onEventResizeStart() {
    this.props.eventResizeStart($(this.calendarRef))
  }

  componentDidMount() {
    const calendarProps = cloneDeep(this.props)

    calendarProps.eventDrop = this.onEventDrop
    calendarProps.eventDragStart = this.onEventDragStart
    calendarProps.dayClick = this.onDayClick
    calendarProps.eventClick = this.onEventClick
    calendarProps.eventDestroy = this.onEventDestroy
    calendarProps.eventRender = this.onEventRender
    calendarProps.eventResize = this.onEventResize
    calendarProps.eventResizeStart = this.onEventResizeStart

    $(this.calendarRef).fullCalendar(calendarProps)
  }

  render() {
    return <div ref={(el) => this.calendarRef = el}/>
  }
}

export {
  Calendar
}
