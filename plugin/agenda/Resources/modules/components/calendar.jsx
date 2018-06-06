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

    this.onDayClick = this.onDayClick.bind(this)
  }

  onDayClick() {
    this.props.dayClick($(this.calendarRef))
  }

  componentDidMount() {
    const calendarProps = cloneDeep(this.props)
    calendarProps.dayClick = this.onDayClick

    $(this.calendarRef).fullCalendar(calendarProps)
  }

  render() {
    return <div ref={(el) => this.calendarRef = el}/>
  }
}

export {
  Calendar
}
