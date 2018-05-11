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

export const actions = {}

actions.newSubject = () => formActions.resetForm(
  'subjects.form',
  merge({}, SubjectTypes.defaultProps, {meta: {creator: currentUser()}}),
  // if
  true
)

actions.loadSubject = makeActionCreator(SUBJECT_LOAD, 'subject')
actions.fetchSubject = (id) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_subject_get', {id}],
    success: (response, dispatch) => {
      dispatch(actions.loadSubject(response))
    }
  }
})

actions.openSubject = (id) => (dispatch, getState) => {
  const subject = select.subject(getState())
  // showform state 
  if (subject.id !== id) {
    dispatch(actions.loadSubject({id: id}))
    dispatch(actions.fetchSubject(id))
  }
}

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
