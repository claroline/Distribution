import merge from 'lodash/merge'

import {now} from '#/main/core/scaffolding/date'
import {currentUser} from '#/main/core/user/current'
import {makeId} from '#/main/core/scaffolding/id'
import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions as listActions} from '#/main/core/data/list/actions'


import {Subject as SubjectTypes} from '#/plugin/forum/resources/forum/player/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'

export const SUBJECT_LOAD = 'SUBJECT_LOAD'
export const MESSAGES_LOAD = 'MESSAGES_LOAD'
export const MESSAGE_UPDATE = 'MESSAGE_UPDATE'
export const SUBJECT_FORM_OPEN = 'SUBJECT_FORM_OPEN'
export const SUBJECT_FORM_CLOSE = 'SUBJECT_FORM_CLOSE'
export const MESSAGES_SORT_TOGGLE = 'MESSAGES_SORT_TOGGLE'
export const SUBJECT_EDIT = 'SUBJECT_EDIT'
export const SUBJECT_STOP_EDIT = 'SUBJECT_STOP_EDIT'
export const actions = {}

actions.toggleMessagesSort = makeActionCreator(MESSAGES_SORT_TOGGLE)
actions.openSubjectForm = makeActionCreator(SUBJECT_FORM_OPEN)
actions.closeSubjectForm = makeActionCreator(SUBJECT_FORM_CLOSE)
actions.subjectEdition = makeActionCreator(SUBJECT_EDIT)
actions.stopSubjectEdition = makeActionCreator(SUBJECT_STOP_EDIT)

actions.newSubject = (id = null) => (dispatch) => {
  dispatch(actions.openSubjectForm())
  if (id) {
    dispatch(actions.subjectEdition())
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_forum_subject_get', {id}],
        success: (data, dispatch) => {
          dispatch(formActions.resetForm('subjects.form', data, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(
      'subjects.form',
      merge({}, SubjectTypes.defaultProps, {
        id: makeId(),
        meta: {creator: currentUser()}
      }),
      true
    ))
  }
}


actions.loadSubject = makeActionCreator(SUBJECT_LOAD, 'subject')
actions.fetchSubject = (id) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_get', {id}],
    success: (data, dispatch) => {
      dispatch(actions.loadSubject(data))
    }
  }
})

actions.openSubject = (id) => (dispatch, getState) => {
  const subject = select.subject(getState())
  // showform state
  if (subject.id !== id) {
    dispatch(actions.loadSubject({id: id}))
    dispatch(actions.fetchSubject(id))
    dispatch(listActions.invalidateData('subjects.messages'))
  }
}


actions.createMessage = (subjectId, content) => ({
  [API_REQUEST]: {
    url: ['claroline_forum_api_subject_createmessage', {id: subjectId}],
    request: {
      method: 'POST',
      body: JSON.stringify({
        id: makeId(),
        content: content,
        meta: {
          creator: currentUser(),
          created: now(),
          updated: now()
        },
        comments: []
      })
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.messages'))
    }
  }
})

actions.editContent = (id, content) => ({
  [API_REQUEST]: {
    url: ['claroline_forum_api_message_updatemessagecontent', {id: id}],
    request: {
      method: 'PUT',
      body: JSON.stringify({content: content})
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.messages'))
    }
  }
})

actions.createComment = (messageId, comment) => ({
  [API_REQUEST]: {
    url: ['claroline_forum_api_message_createcomment', {id: messageId}],
    request: {
      method: 'POST',
      body: JSON.stringify({
        id: makeId(),
        content: comment,
        meta: {
          creator: currentUser(),
          created: now(),
          updated: now()
        }
      })
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.messages'))
    }
  }
})

actions.blockMessage = (message) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_message_update', {id: message.id}],
    request: {
      body: JSON.stringify(Object.assign({}, message, {meta: {blocked:true}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.messages'))
    }
  }
})

actions.stickSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {sticky:true}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.list'))
    }
  }
})

actions.unStickSubject = (subject) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_update', {id: subject.id}],
    request: {
      body: JSON.stringify(Object.assign({}, subject, {meta: {sticky:false}})),
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('subjects.list'))
    }
  }
})
