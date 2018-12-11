import {url} from '#/main/app/api'

import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'
import {actions as listActions} from '#/main/app/content/list/store'

export const actions = {}

actions.openBadge = (formName, id = null) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_badge-class_get', {id}],
        before: (dispatch) => {
          dispatch(formActions.resetForm(formName, {}, false))
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    }
  } else {
    return formActions.resetForm(formName, {}, true)
  }
}

actions.openAssertion = (formName, id = null) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_assertion_get', {id}],
        before: (dispatch) => {
          dispatch(formActions.resetForm(formName, {}, false))
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    }
  } else {
    return formActions.resetForm(formName, {}, true)
  }
}

actions.addUsers = (id, users) => ({
  [API_REQUEST]: {
    url: url(['apiv2_badge_add_users', {badge: id}], {ids: users}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('badges.list'))
      dispatch(listActions.invalidateData('badges.current.users'))
    }
  }
})

//calendarElement is required to refresh the calendar since it's outside react
actions.save = (formName, badge, workspace, isNew) => ({
  [API_REQUEST]: {
    url: isNew ? ['apiv2_badge-class_create']: ['apiv2_badge-class_update', {id: badge.id}],
    request: {
      body: JSON.stringify(Object.assign({}, badge, {workspace})),
      method: isNew ? 'POST': 'PUT'
    },
    success: (response, dispatch) => {
      dispatch(formActions.resetForm(formName, response, false))
    }
  }
})
