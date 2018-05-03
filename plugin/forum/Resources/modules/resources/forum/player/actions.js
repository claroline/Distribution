import merge from 'lodash/merge'

import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {currentUser} from '#/main/core/user/current'
import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {Subject as SubjectTypes} from '#/plugin/forum/resources/forum/player/prop-types'

export const SUBJECT_LOAD = 'SUBJECT_LOAD'

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
    success: (response, dispatch) => dispatch(actions.loadSubject(response))
  }
})
