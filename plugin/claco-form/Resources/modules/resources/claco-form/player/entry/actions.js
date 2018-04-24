import cloneDeep from 'lodash/cloneDeep'

import {generateUrl} from '#/main/core/api/router'
import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {getDataQueryString} from '#/main/core/data/list/utils'
import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'

const ENTRIES_UPDATE = 'ENTRIES_UPDATE'
const ENTRY_ADD = 'ENTRY_ADD'
const ENTRY_UPDATE = 'ENTRY_UPDATE'
const CURRENT_ENTRY_LOAD = 'CURRENT_ENTRY_LOAD'
const CURRENT_ENTRY_UPDATE = 'CURRENT_ENTRY_UPDATE'
const ENTRY_COMMENT_ADD = 'ENTRY_COMMENT_ADD'
const ENTRY_COMMENT_UPDATE = 'ENTRY_COMMENT_UPDATE'
const ENTRY_COMMENT_REMOVE = 'ENTRY_COMMENT_REMOVE'
const ALL_ENTRIES_REMOVE = 'ALL_ENTRIES_REMOVE'
const ENTRY_USER_UPDATE = 'ENTRY_USER_UPDATE'
const ENTRY_USER_UPDATE_PROP = 'ENTRY_USER_UPDATE_PROP'
const ENTRY_USER_RESET = 'ENTRY_USER_RESET'
const ENTRY_CATEGORY_ADD = 'ENTRY_CATEGORY_ADD'
const ENTRY_CATEGORY_REMOVE = 'ENTRY_CATEGORY_REMOVE'
const ENTRY_KEYWORD_ADD = 'ENTRY_KEYWORD_ADD'
const ENTRY_KEYWORD_REMOVE = 'ENTRY_KEYWORD_REMOVE'

const actions = {}

actions.updateEntries = makeActionCreator(ENTRIES_UPDATE)
actions.addEntry = makeActionCreator(ENTRY_ADD, 'entry')
actions.updateEntry = makeActionCreator(ENTRY_UPDATE, 'entry')
actions.loadCurrentEntry = makeActionCreator(CURRENT_ENTRY_LOAD, 'entry')
actions.updateCurrentEntry = makeActionCreator(CURRENT_ENTRY_UPDATE, 'property', 'value')
actions.addEntryComment = makeActionCreator(ENTRY_COMMENT_ADD, 'entryId', 'comment')
actions.updateEntryComment = makeActionCreator(ENTRY_COMMENT_UPDATE, 'entryId', 'comment')
actions.removeEntryComment = makeActionCreator(ENTRY_COMMENT_REMOVE, 'entryId', 'commentId')
actions.removeAllEntries = makeActionCreator(ALL_ENTRIES_REMOVE)
actions.updateEntryUser = makeActionCreator(ENTRY_USER_UPDATE, 'entryUser')
actions.resetEntryUser = makeActionCreator(ENTRY_USER_RESET)
actions.addCategory = makeActionCreator(ENTRY_CATEGORY_ADD, 'category')
actions.removeCategory = makeActionCreator(ENTRY_CATEGORY_REMOVE, 'categoryId')
actions.addKeyword = makeActionCreator(ENTRY_KEYWORD_ADD, 'keyword')
actions.removeKeyword = makeActionCreator(ENTRY_KEYWORD_REMOVE, 'keywordId')

actions.createEntry = (entry, keywords, files) => (dispatch, getState) => {
  const clacoFormId = getState().clacoForm.id
  const formData = new FormData()
  formData.append('entryData', JSON.stringify(entry))
  formData.append('keywordsData', JSON.stringify(keywords))

  Object.keys(files).forEach(fieldId => {
    files[fieldId].forEach((f, idx) => formData.append(`${fieldId}-${idx}`, f))
  })

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_create', {clacoForm: clacoFormId}],
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.addEntry(data))
        dispatch(actions.loadCurrentEntry(data))
      }
    }
  })
}

actions.editEntry = (entryId, entry, keywords, categories, files) => (dispatch) => {
  const formData = new FormData()
  formData.append('entryData', JSON.stringify(entry))
  formData.append('keywordsData', JSON.stringify(keywords))
  formData.append('categoriesData', JSON.stringify(categories))

  Object.keys(files).forEach(fieldId => {
    files[fieldId].forEach((f, idx) => formData.append(`${fieldId}-${idx}`, f))
  })

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_edit', {entry: entryId}],
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntry(data))
        dispatch(actions.loadCurrentEntry(data))
      }
    }
  })
}

actions.deleteEntry = (entryId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_delete', {entry: entryId}],
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntries())
      }
    }
  })
}

actions.deleteEntries = (entries) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: generateUrl('claro_claco_form_entries_delete') + getDataQueryString(entries),
      request: {
        method: 'PATCH'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntries())
      }
    }
  })
}

actions.switchEntryStatus = (entryId) => (dispatch, getState) => {
  const currentEntry = getState().entries.current

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_status_change', {entry: entryId}],
      request: {
        method: 'PUT'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntry(data))

        if (currentEntry && currentEntry.id === entryId) {
          dispatch(actions.loadCurrentEntry(data))
        }
      }
    }
  })
}

actions.switchEntriesStatus = (entries, status) => (dispatch, getState) => {
  const currentEntry = getState().entries.current

  dispatch({
    [API_REQUEST]: {
      url: generateUrl('claro_claco_form_entries_status_change', {status: status}) + getDataQueryString(entries),
      request: {
        method: 'PATCH'
      },
      success: (data, dispatch) => {
        data.forEach(e => {
          dispatch(actions.updateEntry(e))

          if (currentEntry && currentEntry.id === e.id) {
            dispatch(actions.loadCurrentEntry(e))
          }
        })
      }
    }
  })
}

actions.switchEntryLock = (entryId) => ({
  [API_REQUEST]: {
    url: ['claro_claco_form_entry_lock_switch', {entry: entryId}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateEntries())
      // dispatch(actions.updateEntry(data))
      //
      // if (currentEntry && currentEntry.id === entryId) {
      //   dispatch(actions.loadCurrentEntry(data))
      // }
    }
  }
})

actions.switchEntriesLock = (entries, locked) => ({
  [API_REQUEST]: {
    url: generateUrl('claro_claco_form_entries_lock_switch', {locked: locked ? 1 : 0}) + getDataQueryString(entries),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateEntries())
      // data.forEach(e => {
      //   dispatch(actions.updateEntry(e))
      //
      //   if (currentEntry && currentEntry.id === e.id) {
      //     dispatch(actions.loadCurrentEntry(e))
      //   }
      // })
    }
  }
})

actions.downloadEntryPdf = (entryId) => () => {
  window.location.href = generateUrl('claro_claco_form_entry_pdf_download', {entry: entryId})
}

actions.downloadEntriesPdf = (entries) => () => {
  window.location.href = generateUrl('claro_claco_form_entries_pdf_download') + getDataQueryString(entries)
}

actions.createComment = (entryId, content) => (dispatch) => {
  const formData = new FormData()
  formData.append('commentData', content)

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_comment_create', {entry: entryId}],
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.addEntryComment(entryId, data))
      }
    }
  })
}

actions.editComment = (entryId, commentId, content) => (dispatch) => {
  const formData = new FormData()
  formData.append('commentData', content)

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_comment_edit', {comment: commentId}],
      request: {
        method: 'POST',
        body: formData
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntryComment(entryId, data))
      }
    }
  })
}

actions.deleteComment = (entryId, commentId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_comment_delete', {comment: commentId}],
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
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_comment_activate', {comment: commentId}],
      request: {
        method: 'PUT'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntryComment(entryId, data))
      }
    }
  })
}

actions.blockComment = (entryId, commentId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_comment_block', {comment: commentId}],
      request: {
        method: 'PUT'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntryComment(entryId, data))
      }
    }
  })
}

actions.changeEntryOwner = (entryId, userId) => (dispatch, getState) => {
  const currentEntry = getState().entries.current

  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_user_change', {entry: entryId, user: userId}],
      request: {
        method: 'PUT'
      },
      success: (data, dispatch) => {
        dispatch(actions.updateEntry(data))

        if (currentEntry && currentEntry.id === entryId) {
          dispatch(actions.loadCurrentEntry(data))
        }
      }
    }
  })
}

actions.shareEntry = (entryId, userId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_user_share', {entry: entryId, user: userId}],
      request: {
        method: 'PUT'
      }
    }
  })
}

actions.unshareEntry = (entryId, userId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['claro_claco_form_entry_user_unshare', {entry: entryId, user: userId}],
      request: {
        method: 'PUT'
      }
    }
  })
}

actions.openForm = (formName, id = null, defaultProps) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_clacoformentry_get', {id}],
        success: (data, dispatch) => dispatch(formActions.resetForm(formName, data, false))
      }
    }
  } else {
    return formActions.resetForm(formName, defaultProps, true)
  }
}

actions.loadEntryUser = (entryId) => ({
  [API_REQUEST]: {
    url: ['claro_claco_form_entry_user_retrieve', {entry: entryId}],
    success: (data, dispatch) => dispatch(actions.updateEntryUser(data))
  }
})

actions.updateEntryUserProp = makeActionCreator(ENTRY_USER_UPDATE_PROP, 'property', 'value')

actions.saveEntryUser = (entryUser) => ({
  [API_REQUEST]: {
    url: ['apiv2_clacoformentryuser_update', {id: entryUser['id']}],
    request: {
      method: 'PUT',
      body: JSON.stringify(entryUser)
    },
    success: (data, dispatch) => {
      dispatch(actions.updateEntryUser(data))
    }
  }
})

actions.editAndSaveEntryUser = (property, value) => (dispatch, getState) => {
  const entryUser = cloneDeep(getState().entries.entryUser)
  entryUser[property] = value
  dispatch(actions.saveEntryUser(entryUser))
}

export {
  actions,
  ENTRIES_UPDATE,
  ENTRY_ADD,
  ENTRY_UPDATE,
  CURRENT_ENTRY_LOAD,
  CURRENT_ENTRY_UPDATE,
  ENTRY_COMMENT_ADD,
  ENTRY_COMMENT_UPDATE,
  ENTRY_COMMENT_REMOVE,
  ALL_ENTRIES_REMOVE,
  ENTRY_USER_UPDATE,
  ENTRY_USER_UPDATE_PROP,
  ENTRY_USER_RESET,
  ENTRY_CATEGORY_ADD,
  ENTRY_CATEGORY_REMOVE,
  ENTRY_KEYWORD_ADD,
  ENTRY_KEYWORD_REMOVE
}