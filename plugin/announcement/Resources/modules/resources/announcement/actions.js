import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'

import {REQUEST_SEND} from '#/main/core/api/actions'

export const ANNOUNCE_CREATE = 'ANNOUNCE_CREATE'
export const ANNOUNCE_REMOVE = 'ANNOUNCE_REMOVE'
export const ANNOUNCE_SEND   = 'ANNOUNCE_SEND'

export const actions = {}

actions.createAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_create_announce'),
    request: {
      method: 'POST'
    },
    success: (data, dispatch) => {

    }
  }
})

actions.updateAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_update_announce'),
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {

    }
  }
})

actions.removeAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_delete_announce'),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {

    }
  }
})

actions.sendMail = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_send_announce'),
    request: {
      method: 'POST'
    },
    success: (data, dispatch) => {

    }
  }
})
