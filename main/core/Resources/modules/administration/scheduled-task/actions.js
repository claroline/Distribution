import {makeActionCreator} from '#/main/core/scaffolding/actions'

import {now} from '#/main/core/scaffolding/date'
import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'

export const actions = {}

actions.open = (formName, id = null) => (dispatch) => {
  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_scheduledtask_get', {id}],
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, {
      scheduledDate: now()
    }, true))
  }
}

actions.addUsers = (id, users) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_task_add_users', {id: id}) +'?'+ users.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('task'))
      dispatch(listActions.invalidateData('task.users'))
    }
  }
})
