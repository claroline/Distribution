import {generateUrl} from '#/main/core/fos-js-router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions as listActions} from '#/main/core/data/list/actions'
import {Location as LocationTypes} from '#/main/core/administration/user/location/prop-types'

export const actions = {}

//actions.geolocate = makeActionCreator(ROLE_EDIT, 'location')
//actions.saveRole = makeActionCreator(ROLE_SAVE)

actions.geolocate = (location) => ({
  [API_REQUEST]: {
    url: ['apiv2_location_geolocate', {id: location.id}],
    success: (data, dispatch) => dispatch(listActions.fetchData('locations'))
  }
})

actions.open = (formName, id = null) => (dispatch) => {
  // todo ugly. only to be able to load list before the end of  group loading
  dispatch(formActions.resetForm(formName, {id}, false))

  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_location_get', {id}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, true))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, LocationTypes.defaultProps, true))
  }
}

actions.addUsers = (id, users) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_location_add_users', {id: id}) +'?'+ users.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('locations.list'))
      dispatch(listActions.invalidateData('locations.current.users'))
    }
  }
})

actions.addGroups = (id, groups) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_location_add_groups', {id: id}) +'?'+ groups.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('locations.list'))
      dispatch(listActions.invalidateData('locations.current.groups'))
    }
  }
})
