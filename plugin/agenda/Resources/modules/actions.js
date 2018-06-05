import {API_REQUEST} from '#/main/app/api'

export const actions = {}

actions.create = event => ({
  [API_REQUEST]: {
    url: ['apiv2_event_create'],
    request: {
      body: JSON.stringify(event),
      method: 'POST'
    },
    success: (data, dispatch) => {
      console.log('success')
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
