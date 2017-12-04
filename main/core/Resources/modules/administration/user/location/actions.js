import {API_REQUEST} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/fos-js-router'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {Location as LocationTypes} from '#/main/core/administration/user/location/prop-types'
import {actions as formActions} from '#/main/core/layout/form/actions'

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
