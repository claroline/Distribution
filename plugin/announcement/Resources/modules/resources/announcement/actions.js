import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'

import {REQUEST_SEND} from '#/main/core/api/actions'

export const ANNOUNCE_ADD    = 'ANNOUNCE_ADD'
export const ANNOUNCE_UPDATE = 'ANNOUNCE_UPDATE'
export const ANNOUNCE_DELETE = 'ANNOUNCE_DELETE'
export const ANNOUNCES_SORT_TOGGLE  = 'ANNOUNCES_SORT_TOGGLE'
export const ANNOUNCES_PAGE_CHANGE = 'ANNOUNCES_PAGE_CHANGE'

export const actions = {}

actions.toggleAnnouncesSort = makeActionCreator(ANNOUNCES_SORT_TOGGLE)
actions.changeAnnouncesPage = makeActionCreator(ANNOUNCES_PAGE_CHANGE, 'page')

actions.addAnnounce = makeActionCreator(ANNOUNCE_ADD, 'announce')
actions.createAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_create_announce'),
    request: {
      method: 'POST'
    },
    success: (data, dispatch) => dispatch(actions.addAnnounce(announce))
  }
})

actions.updateAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_update_announce', {id: announce.id}),
    request: {
      method: 'PUT',
      body: JSON.stringify(announce)
    },
    success: (data, dispatch) => {

    }
  }
})

actions.deleteAnnounce = makeActionCreator(ANNOUNCE_ADD, 'announce')
actions.removeAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_delete_announce', {id: announce.id}),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => dispatch(actions.deleteAnnounce(announce ))
  }
})

actions.sendMail = (announce, users) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_send_announce', {id: announce.id}),
    request: {
      method: 'POST'
    },
    success: () => {
     // todo : alert success
    }
  }
})
