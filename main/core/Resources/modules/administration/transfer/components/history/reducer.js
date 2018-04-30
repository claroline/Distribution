import {API_REQUEST} from '#/main/core/api/actions'

export const LOG_REFRESH = 'LOG_REFRESH'
export const actions = {}

actions.load = (file) => {
  return {
    [API_REQUEST]: {
      url: ['apiv2_logger_get', {name: file}],
      success: (response, dispatch) => {
        dispatch(actions.refresh(response))
      }
    }
  }
}
