import {url} from '#/main/app/api'

import {API_REQUEST} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'
import {actions as formActions} from '#/main/app/content/form/store'

export const actions = {}

actions.enable = (badges) => ({
  [API_REQUEST]: {
    url: url(['apiv2_badge-class_enable'], {ids: badges.map(u => u.id)}),
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('badges.list'))
    }
  }
})

actions.disable = (badges) => ({
  [API_REQUEST]: {
    url: url(['apiv2_badge-class_disable'], {ids: badges.map(u => u.id)}),
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('badges.list'))
    }
  }
})

actions.save = (formName, badge, workspace, isNew) => ({
  [API_REQUEST]: {
    url: isNew ? ['apiv2_badge-class_create']: ['apiv2_badge-class_update', {id: badge.id}],
    request: {
      body: JSON.stringify(Object.assign({}, badge, {workspace})),
      method: isNew ? 'POST': 'PUT'
    },
    success: (response, dispatch) => {
      dispatch(formActions.resetForm(formName, response, false))
      dispatch(listActions.invalidateData('badges.list'))
    }
  }
})
