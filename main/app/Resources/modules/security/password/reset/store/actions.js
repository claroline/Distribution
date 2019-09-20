import {API_REQUEST} from '#/main/app/api'

// action creators
export const actions = {}
/**
 * Fetch the required data to open the current user desktop.
 */
actions.reset = (data) => ({
  [API_REQUEST]: {
    url: ['claro_security_new_password'],
    request: {
      method: 'POST',
      body: JSON.stringify(data)
    },
    success: () => {
    },
    error: () => {
    }
  }
})
