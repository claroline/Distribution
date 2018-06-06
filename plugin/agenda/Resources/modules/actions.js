import {API_REQUEST} from '#/main/app/api'

import $ from 'jquery'

export const actions = {}

//calendarElement is required to refresh the calendar since it's outside react
actions.create = (event, calendarRef) => ({
  [API_REQUEST]: {
    url: ['apiv2_event_create'],
    request: {
      body: JSON.stringify(event),
      method: 'POST'
    },
    success: (data) => {
      calendarRef.fullCalendar('renderEvent', data)
    }
  }
})

actions.update = (event, calendarRef) => ({
  [API_REQUEST]: {
    url: ['apiv2_event_update', {id: event.id}],
    request: {
      body: JSON.stringify(event),
      method: 'PUT'
    },
    success: (data) => {
      calendarRef.fullCalendar('renderEvent', data)
    }
  }
})
