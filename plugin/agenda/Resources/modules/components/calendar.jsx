import React, { Component } from 'react'

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
  }

  componentDidMount() {
    console.log(this.props)
    $(this.calendarRef).fullCalendar(this.props)
  }

  render() {
    return <div ref={(el) => this.calendarRef = el}/>
  }
}

export {
  Calendar
}
