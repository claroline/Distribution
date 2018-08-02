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

actions.registerUsers = (teamId, users) => ({
  [API_REQUEST]: {
    url: url(['apiv2_team_register', {team: teamId}], {ids: users}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('teams.current.users'))
    }
  }
})

export {
  actions
}