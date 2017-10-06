import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'

import {REQUEST_SEND} from '#/main/core/api/actions'

export const ANNOUNCE_ADD    = 'ANNOUNCE_ADD'
export const ANNOUNCE_CHANGE = 'ANNOUNCE_CHANGE'
export const ANNOUNCE_DELETE = 'ANNOUNCE_DELETE'

export const ANNOUNCES_SORT_TOGGLE  = 'ANNOUNCES_SORT_TOGGLE'
export const ANNOUNCES_PAGE_CHANGE = 'ANNOUNCES_PAGE_CHANGE'

export const ANNOUNCE_FORM_OPEN  = 'ANNOUNCE_FORM_OPEN'
export const ANNOUNCE_FORM_RESET = 'ANNOUNCE_FORM_RESET'
export const ANNOUNCE_FORM_UPDATE = 'ANNOUNCE_FORM_UPDATE'

export const ANNOUNCE_DETAIL_OPEN = 'ANNOUNCE_DETAIL_OPEN'

export const actions = {}

actions.toggleAnnouncesSort = makeActionCreator(ANNOUNCES_SORT_TOGGLE)
actions.changeAnnouncesPage = makeActionCreator(ANNOUNCES_PAGE_CHANGE, 'page')

actions.openDetail = makeActionCreator(ANNOUNCE_DETAIL_OPEN, 'announceId')

actions.openForm = makeActionCreator(ANNOUNCE_FORM_OPEN, 'announce')
actions.resetForm = makeActionCreator(ANNOUNCE_FORM_RESET)
actions.updateForm = makeActionCreator(ANNOUNCE_FORM_UPDATE, 'prop', 'value')

actions.addAnnounce = makeActionCreator(ANNOUNCE_ADD, 'announce')
actions.createAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_create_announce'),
    request: {
      method: 'POST',
      body: JSON.stringify(announce)
    },
    success: (data, dispatch) => {
      dispatch(actions.addAnnounce(announce))
      dispatch(actions.resetForm())
    }
  }
})

actions.changeAnnounce = makeActionCreator(ANNOUNCE_CHANGE, 'announce')
actions.updateAnnounce = (announce) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_update_announce', {id: announce.id}),
    request: {
      method: 'PUT',
      body: JSON.stringify(announce)
    },
    success: (data, dispatch) => {
      dispatch(actions.changeAnnounce(announce))
      dispatch(actions.resetForm())
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
