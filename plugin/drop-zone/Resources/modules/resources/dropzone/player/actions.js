import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {REQUEST_SEND} from '#/main/core/api/actions'
import {select} from '../selectors'
import {constants} from '../constants'

export const MY_DROP_LOAD = 'MY_DROP_LOAD'
export const MY_DROP_UPDATE = 'MY_DROP_UPDATE'
export const DOCUMENTS_ADD = 'DOCUMENTS_ADD'
export const DOCUMENT_REMOVE = 'DOCUMENT_REMOVE'

export const actions = {}

actions.loadMyDrop = makeActionCreator(MY_DROP_LOAD, 'drop')
actions.updateMyDrop = makeActionCreator(MY_DROP_UPDATE, 'property', 'value')
actions.addDocuments = makeActionCreator(DOCUMENTS_ADD, 'documents')
actions.removeDocument = makeActionCreator(DOCUMENT_REMOVE, 'documentId')

actions.saveDrop = (dropType, dropData) => (dispatch, getState) => {
  const state = getState()
  const myDropId = select.myDropId(state)
  const formData = new FormData()

  if (dropType === constants.DOCUMENT_TYPES.file.value) {
    dropData.forEach((file, idx) => formData.append(`fileDrop${idx}`, file))
  } else {
    formData.append('dropData', dropData)
  }

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_dropzone_documents_add', {id: myDropId, type: dropType}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.addDocuments(data))
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

actions.renderMyDrop = () => (dispatch, getState) => {
  const myDropId = select.myDropId(getState())

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_dropzone_drop_submit', {id: myDropId}),
      request: {
        method: 'PUT'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateMyDrop('finished', true))
        dispatch(actions.updateMyDrop('dropDate', data.dropDate))
      }
    }
  })
}