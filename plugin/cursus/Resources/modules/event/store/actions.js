import isEmpty from 'lodash/isEmpty'
import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

import {selectors} from '#/plugin/cursus/event/store/selectors'

export const LOAD_EVENT = 'LOAD_EVENT'

export const actions = {}

actions.loadEvent = makeActionCreator(LOAD_EVENT, 'event', 'registrations')

actions.open = (id, force = false) => (dispatch, getState) => {
  const currentEvent = selectors.event(getState())
  if (force || isEmpty(currentEvent) || currentEvent.id !== id) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_cursus_event_open', {id: id}],
        silent: true,
        before: () => dispatch(actions.loadEvent(null, null)),
        success: (data) => dispatch(actions.loadEvent(data.event, data.registrations))
      }
    })
  }
}

actions.register = (id) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_event_self_register', {id: id}],
    request: {
      method: 'PUT'
    },
    success: (response, dispatch) => dispatch(actions.open(id, true))
  }
})