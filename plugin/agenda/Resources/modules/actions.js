import {API_REQUEST} from '#/main/core/api/actions'

export const actions = {}

actions.create = event => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update'],
    request: {
      body: JSON.stringify(event),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.update = event => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update'],
    request: {
      body: JSON.stringify(event),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.list'))
      dispatch(actions.loadSubject(data))
    }
  }
})
