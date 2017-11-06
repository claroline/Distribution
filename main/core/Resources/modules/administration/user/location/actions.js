import {REQUEST_SEND} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/fos-js-router'
import {actions as listActions} from '#/main/core/layout/list/actions'
export const LOCATION_GEOLOCATE = 'LOCATION_GEOLOCATE'

export const actions = {}

//actions.geolocate = makeActionCreator(ROLE_EDIT, 'location')
//actions.saveRole = makeActionCreator(ROLE_SAVE)

actions.geolocate = (location, page) => ({
  [REQUEST_SEND]: {
    url: generateUrl('apiv2_location_geolocate', {uuid: location.uuid}),
    success: (data, dispatch) => dispatch(listActions.fetchData('locations'))
  }
})
