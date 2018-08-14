import merge from 'lodash/merge'

import {now} from '#/main/core/scaffolding/date'
import {currentUser} from '#/main/core/user/current'
import {makeId} from '#/main/core/scaffolding/id'
import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'
import {actions as formActions} from '#/main/app/content/form/store'

import {Message as MessageTypes} from '#/plugin/message/prop-types'

export const MESSAGE_LOAD = 'MESSAGE_LOAD'
export const IS_REPLY = 'IS_REPLY'
export const actions = {}

actions.setAsReply = makeActionCreator(IS_REPLY)

actions.newMessage = (id = null) => (dispatch) => {
  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_message_root', {id}],
        success: (data, dispatch) => {
          dispatch(formActions.resetForm(
            'messageForm',
            merge({}, MessageTypes.defaultProps, {
              id: makeId(),
              from: currentUser(),
              to: data.from.username,
              object: `Re: ${data.object}`,
              meta: {date : now()}
            }),
            true))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(
      'messageForm',
      merge({}, MessageTypes.defaultProps, {
        id: makeId(),
        from: currentUser(),
        meta: {date : now()}
      }),
      true
    ))
  }
}


actions.deleteMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_user_remove', {ids: messages.map(message => message.id)}],
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('deletedMessages'))
    }
  }
})

actions.removeMessages = (messages, form = null) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_soft_delete', {ids: messages.map(message => message.id)}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      if (form) {
        dispatch(listActions.invalidateData(form))
      }
    }
  }
})


actions.restoreMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_restore', {ids: messages.map(message => message.id)}],
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
    url: ['apiv2_message_root', {id}],
    success: (data, dispatch) => {
      dispatch(actions.loadMessage(data))
    }
  }
})

actions.openMessage = (id) => (dispatch) => {
  dispatch(actions.loadMessage({id: id}))
  dispatch(actions.fetchMessage(id))
  dispatch(actions.readMessages([id]))
}

actions.readMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_read', {ids: messages.map(message => message.id)}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('receivedMessages'))
    }
  }
})

actions.unreadMessages = (messages) => ({
  [API_REQUEST]: {
    url: ['apiv2_message_unread', {ids: messages.map(message => message.id)}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('receivedMessages'))
    }
  }
})
