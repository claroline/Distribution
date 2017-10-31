import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {actions as listActions} from '#/main/core/layout/list/actions'

import {REQUEST_SEND} from '#/main/core/api/actions'

export const actions = {}

actions.removeUsers = (users) => ({
  [REQUEST_SEND]: {
    url: generateUrl('apiv2_user_delete_bulk') + getDataQueryString(users),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      //do something better
      dispatch(listActions.changePage(0))
      dispatch(listActions.fetchData('users'))
    }
  }
})
