import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/layout/form/actions'

import {Group as GroupTypes} from '#/main/core/administration/user/group/prop-types'

export const actions = {}

actions.open = (formName, id = null) => (dispatch) => {
  if (id) {
    // todo ugly. only to be able to load list before the end of  group loading
    dispatch(formActions.resetForm(formName, {id}, false))

    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_group_get', {id}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => dispatch(formActions.resetForm(formName, response, false))
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, GroupTypes.defaultProps, true))
  }
}
