import isEmpty from 'lodash/isEmpty'

import {API_REQUEST, url} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {actions as listActions} from '#/main/app/content/list/store/actions'

import {constants} from '#/plugin/cursus/constants'
import {selectors} from '#/plugin/cursus/tools/trainings/catalog/store/selectors'

export const LOAD_COURSE = 'LOAD_COURSE'
export const LOAD_COURSE_SESSION = 'LOAD_COURSE_SESSION'

export const actions = {}

actions.loadCourse = makeActionCreator(LOAD_COURSE, 'course', 'defaultSession', 'availableSessions')
actions.loadSession = makeActionCreator(LOAD_COURSE_SESSION, 'session')

actions.open = (courseSlug, force = false) => (dispatch, getState) => {
  const currentCourse = selectors.course(getState())
  if (force || isEmpty(currentCourse) || currentCourse.slug !== courseSlug) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_cursus_course_open', {slug: courseSlug}],
        silent: true,
        before: () => dispatch(actions.loadCourse(null, null, [])),
        success: (data) => dispatch(actions.loadCourse(data.course, data.defaultSession, data.availableSessions))
      }
    })
  }
}

actions.openForm = (courseSlug = null, defaultProps = {}) => (dispatch) => {
  if (!courseSlug) {
    return dispatch(formActions.resetForm(selectors.FORM_NAME, defaultProps, true))
  }

  return dispatch({
    [API_REQUEST]: {
      url: url(['apiv2_cursus_course_find'], {filters: {slug: courseSlug}}),
      silent: true,
      success: (data) => dispatch(formActions.resetForm(selectors.FORM_NAME, data))
    }
  })
}

actions.openSession = (sessionId) => (dispatch, getState) => {
  const currentSession = selectors.activeSession(getState())
  if (isEmpty(currentSession) || currentSession.id !== sessionId) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_cursus_session_get', {id: sessionId}],
        silent: true,
        success: (data) => dispatch(actions.loadSession(data))
      }
    })
  }
}

actions.addTutors = (sessionId, users) => ({
  [API_REQUEST]: {
    url: url(['apiv2_cursus_session_add_users', {id: sessionId, type: constants.TEACHER_TYPE}], {ids: users.map(user => user.id)}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.courseTutors'))
    }
  }
})


actions.register = (sessionId) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_session_self_register', {id: sessionId}],
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {

    }
  }
})
