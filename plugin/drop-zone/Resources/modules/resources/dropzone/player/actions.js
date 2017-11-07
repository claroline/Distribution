import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
//import {navigate} from '#/main/core/router'
import {REQUEST_SEND} from '#/main/core/api/actions'
//import {isValid} from './validator'
import {select} from '../selectors'

export const MY_DROP_LOAD = 'MY_DROP_LOAD'
export const DOCUMENT_ADD = 'DOCUMENT_ADD'
export const DOCUMENT_REMOVE = 'DOCUMENT_REMOVE'

export const actions = {}

actions.loadMyDrop = makeActionCreator(MY_DROP_LOAD, 'drop')
actions.addDocument = makeActionCreator(DOCUMENT_ADD, 'document')
actions.removeDocument = makeActionCreator(DOCUMENT_REMOVE, 'documentId')

actions.saveDrop = (dropType, dropData) => (dispatch, getState) => {
  const state = getState()
  const myDropId = select.myDropId(state)
  const formData = new FormData()
  formData.append('dropData', dropData)

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_dropzone_document_add', {id: myDropId, type: dropType}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.addDocument(data))
      }
    }
  })
}

actions.deleteDocument = (documentId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_document_delete', {id: documentId}),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(actions.removeDocument(documentId))
    }
  }
})