import {API_REQUEST, url} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'
import {actions as listActions} from '#/main/app/content/list/store'

const actions = {}

actions.openForm = (formName, id = null, defaultProps) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_team_get', {id}],
        success: (data, dispatch) => dispatch(formActions.resetForm(formName, data, false))
      }
    }
  } else {
    return formActions.resetForm(formName, defaultProps, true)
  }
}

actions.registerUsers = (teamId, users, role = 'user') => ({
  [API_REQUEST]: {
    url: url(['apiv2_team_register', {team: teamId, role: role}], {ids: users}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      switch (role) {
        case 'user':
          dispatch(listActions.invalidateData('teams.current.users'))
          break
        case 'manager':
          dispatch(listActions.invalidateData('teams.current.managers'))
          break
      }
    }
  }
})

export {
  actions
}