import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

export const LOAD_MODEL = 'LOAD_MODEL'

export const actions = {}

actions.loadModel = makeActionCreator(LOAD_MODEL, 'data')

actions.fetchModel = (model) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_get', {id: model.id}],
    request: {
      method: 'GET'
    },
    success: (response, dispatch) => {
      dispatch(actions.loadModel(response))
    }
  }
})
