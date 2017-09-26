import {generateUrl} from '#/main/core/fos-js-router'
import {makeActionCreator} from '#/main/core/utilities/redux'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const actions = {}

export const ENTRY_ADD = 'ENTRY_ADD'
export const ENTRY_UPDATE = 'ENTRY_UPDATE'
export const ENTRY_REMOVE = 'ENTRY_REMOVE'
export const CURRENT_ENTRY_LOAD = 'CURRENT_ENTRY_LOAD'
export const CURRENT_ENTRY_UPDATE = 'CURRENT_ENTRY_UPDATE'
export const ENTRY_COMMENT_ADD = 'ENTRY_COMMENT_ADD'
export const ENTRY_COMMENT_UPDATE = 'ENTRY_COMMENT_UPDATE'
export const ENTRY_COMMENT_REMOVE = 'ENTRY_COMMENT_REMOVE'

actions.addEntry = makeActionCreator(ENTRY_ADD, 'entry')
actions.updateEntry = makeActionCreator(ENTRY_UPDATE, 'entry')
actions.removeEntry = makeActionCreator(ENTRY_REMOVE, 'entryId')
actions.loadCurrentEntry = makeActionCreator(CURRENT_ENTRY_LOAD, 'entry')
actions.updateCurrentEntry = makeActionCreator(CURRENT_ENTRY_UPDATE, 'property', 'value')
actions.addEntryComment = makeActionCreator(ENTRY_COMMENT_ADD, 'entryId', 'comment')
actions.updateEntryComment = makeActionCreator(ENTRY_COMMENT_UPDATE, 'entryId', 'comment')
actions.removeEntryComment = makeActionCreator(ENTRY_COMMENT_REMOVE, 'entryId', 'commentId')

actions.createEntry = (entry, keywords) => (dispatch, getState) => {
  const resourceId = getState().resource.id
  const formData = new FormData()
  formData.append('entryData', JSON.stringify(entry))
  formData.append('keywordsData', JSON.stringify(keywords))

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_create', {clacoForm: resourceId}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.addEntry(JSON.parse(data)))
      }
    }
  })
}

actions.editEntry = (entryId, entry, keywords, categories) => (dispatch) => {
  const formData = new FormData()
  formData.append('entryData', JSON.stringify(entry))
  formData.append('keywordsData', JSON.stringify(keywords))
  formData.append('categoriesData', JSON.stringify(categories))

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_edit', {entry: entryId}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntry(JSON.parse(data)))
      }
    }
  })
}

actions.deleteEntry = (entryId) => (dispatch) => {
  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_delete', {entry: entryId}),
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        dispatch(actions.removeEntry(entryId))
      }
    }
  })
}

actions.loadEntry = (entryId) => (dispatch, getState) => {
  const state = getState()
  const entries = state.entries
  let entry = entries.find(e => e.id === entryId)

  if (!entry) {
    const myEntries = state.myEntries
    entry = myEntries.find(e => e.id === entryId)
  }
  if (entry) {
    dispatch(actions.loadCurrentEntry(entry))
  } else {
    dispatch({
      [REQUEST_SEND]: {
        url: generateUrl('claro_claco_form_entry_retrieve', {entry: entryId}),
        request: {
          method: 'GET'
        },
        success: (data, dispatch) => {
          dispatch(actions.loadCurrentEntry(JSON.parse(data)))
        }
      }
    })
  }
}

actions.createComment = (entryId, content) => (dispatch) => {
  const formData = new FormData()
  formData.append('commentData', content)

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_comment_create', {entry: entryId}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.addEntryComment(entryId, JSON.parse(data)))
      }
    }
  })
}

actions.editComment = (entryId, commentId, content) => (dispatch) => {
  const formData = new FormData()
  formData.append('commentData', content)

  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_comment_edit', {comment: commentId}),
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntryComment(entryId, JSON.parse(data)))
      }
    }
  })
}

actions.deleteComment = (entryId, commentId) => (dispatch) => {
  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_comment_delete', {comment: commentId}),
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        dispatch(actions.removeEntryComment(entryId, commentId))
      }
    }
  })
}

actions.activateComment = (entryId, commentId) => (dispatch) => {
  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_comment_activate', {comment: commentId}),
      request: {
        method: 'PUT'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntryComment(entryId, JSON.parse(data)))
      }
    }
  })
}

actions.blockComment = (entryId, commentId) => (dispatch) => {
  dispatch({
    [REQUEST_SEND]: {
      url: generateUrl('claro_claco_form_entry_comment_block', {comment: commentId}),
      request: {
        method: 'PUT'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntryComment(entryId, JSON.parse(data)))
      }
    }
  })
}