import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const DROPS_LOAD = 'DROPS_LOAD'

export const actions = {}

actions.loadDrops = makeActionCreator(DROPS_LOAD, 'drops')

actions.fetchDrops = (dropzoneId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_drops_search', {id: dropzoneId}),
    request: {
      method: 'GET'
    },
    success: (data, dispatch) => {
      dispatch(actions.loadDrops(data))
    }
  }
})