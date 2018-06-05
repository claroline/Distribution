import {API_REQUEST} from '#/main/app/api'

export const actions = {}

//calendarElement is required to refresh the calendar since it's outside react
actions.create = (event, $calendarElement) => ({
  [API_REQUEST]: {
    url: ['apiv2_event_create'],
    request: {
      body: JSON.stringify(event),
      method: 'POST'
    },
    success: (data) => {
      $calendarElement.fullCalendar('renderEvent', data)
    }
  }
})

actions.update = event => ({
  [API_REQUEST]: {
    url: ['apiv2_event_update', {id: event.id}],
    request: {
      body: JSON.stringify(event),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      console.log('success')
    }
  }
})
