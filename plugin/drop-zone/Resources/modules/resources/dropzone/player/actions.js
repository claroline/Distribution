import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {REQUEST_SEND} from '#/main/core/api/actions'
import {navigate} from '#/main/core/router'

import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'

export const MY_DROP_LOAD = 'MY_DROP_LOAD'
export const MY_DROP_UPDATE = 'MY_DROP_UPDATE'
export const DOCUMENTS_ADD = 'DOCUMENTS_ADD'
export const DOCUMENT_UPDATE = 'DOCUMENT_UPDATE'
export const DOCUMENT_REMOVE = 'DOCUMENT_REMOVE'
export const PEER_DROP_LOAD = 'PEER_DROP_LOAD'
export const PEER_DROP_RESET = 'PEER_DROP_RESET'
export const PEER_DROPS_INC = 'PEER_DROPS_INC'

export const actions = {}

actions.loadMyDrop = makeActionCreator(MY_DROP_LOAD, 'drop')
actions.updateMyDrop = makeActionCreator(MY_DROP_UPDATE, 'property', 'value')
actions.addDocuments = makeActionCreator(DOCUMENTS_ADD, 'documents')
actions.updateDocument = makeActionCreator(DOCUMENT_UPDATE, 'document')
actions.removeDocument = makeActionCreator(DOCUMENT_REMOVE, 'documentId')

actions.initializeMyDrop = () => (dispatch, getState) => {
  const dropzoneId = select.dropzoneId(getState())

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_dropzone_my_drop_initialize', {id: dropzoneId}),
      request: {
        method: 'POST'
      },
      success: (data, dispatch) => {
        dispatch(actions.loadMyDrop(data))
        navigate('/my/drop')
      }
    }
  })
}

actions.saveDocument = (dropType, dropData) => (dispatch, getState) => {
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

actions.fetchPeerDrop = () => (dispatch, getState) => {
  const state = getState()
  const peerDrop = select.peerDrop(state)

  if (!peerDrop) {
    const dropzoneId = select.dropzoneId(state)

    dispatch({
      [REQUEST_SEND]: {
        url: generateUrl('claro_dropzone_peer_drop_fetch', {id: dropzoneId}),
        request: {
          method: 'GET'
        },
        success: (data, dispatch) => {
          if (data && data.id) {
            dispatch(actions.loadPeerDrop(data))
          }
        }
      }
    })
  }
}

actions.loadPeerDrop = makeActionCreator(PEER_DROP_LOAD, 'drop')
actions.resetPeerDrop = makeActionCreator(PEER_DROP_RESET)
actions.incPeerDrop = makeActionCreator(PEER_DROPS_INC)

actions.submitCorrection = (correctionId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_correction_submit', {id: correctionId}),
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(actions.incPeerDrop())
      dispatch(actions.resetPeerDrop())
      navigate('/')
    }
  }
})
