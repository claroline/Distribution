import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/message/selectors'

export const MESSAGE_LOAD = 'MESSAGE_LOAD'
export const SET_TITLE = 'SET_TITLE'
export const actions = {}

actions.setTitle = makeActionCreator(SET_TITLE, 'title')

actions.removeMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_restore', {ids: messages.map(message => message.id)}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('receivedMessages'))
    }
  }
})

actions.restoreMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_soft_delete', {ids: messages.map(message => message.id)}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('deletedMessages'))
    }
  }
})

actions.loadMessage = makeActionCreator(MESSAGE_LOAD, 'message')
actions.fetchMessage = (id) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_get', {id}],
    success: (data, dispatch) => {
      dispatch(actions.loadMessage(data))
    }
  }
})

actions.openMessage = (id) => (dispatch, getState) => {
  const message = selectors.message(getState())
  if (message.id !== id) {
    dispatch(actions.loadMessage({id: id}))
    dispatch(actions.fetchMessage(id))
  }
}
