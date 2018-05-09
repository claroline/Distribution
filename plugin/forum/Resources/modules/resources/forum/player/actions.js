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
  if (subject.id !== id) {
    dispatch(actions.loadSubject({id: id}))
    dispatch(actions.fetchSubject(id))
  }
}


actions.createMessage = (subjectId, content) => ({
  [API_REQUEST]: {
    url: ['apiv2_forum_message_create', {subject: subjectId}],
    request: {
      method: 'POST',
      body: JSON.stringify({
        id: makeId(),
        subjectId: subjectId,
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
    url: ['claroline_forum_api_message_createcomment', {message: messageId}],
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
