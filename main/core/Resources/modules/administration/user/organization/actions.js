import {REQUEST_SEND} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/layout/form/actions'

/*import {Group as GroupTypes} from '#/main/core/administration/user/group/prop-types'*/

export const actions = {}

actions.open = (formName, organizationId = null) => (dispatch) => {
  if (organizationId) {
    // todo ugly. only to be able to load lists before the end of organization loading
    dispatch(formActions.resetForm(formName, {id: organizationId}, false))

    dispatch({
      [REQUEST_SEND]: {
        url: ['apiv2_organization_get', {id: organizationId}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, {}, true))
  }
}
