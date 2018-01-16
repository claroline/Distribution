import {generateUrl} from '#/main/core/api/router'
import {API_REQUEST} from '#/main/core/api/actions'
import {actions as listActions} from '#/main/core/data/list/actions'

export const actions = {}

actions.createContacts = (users) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_contacts_create') +'?'+ users.map(u => 'ids[]='+u).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('contacts'))
      dispatch(listActions.invalidateData('users.picker'))
    }
  }
})
